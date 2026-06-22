const express = require("express");
const Project = require("../models/Project");
const Contribution = require("../models/Contribution");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * POST /api/contributions
 * Create a simulated contribution (payment included)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      projectId,
      amount,
      paymentMethod,
      message,
      anonymous,
      rewardId
    } = req.body;

    // 1. Validate project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 2. Check project status
    if (project.status !== "active") {
      return res.status(400).json({ message: "Project is not active" });
    }

    // 3. Check deadline
    if (new Date(project.deadline) < new Date()) {
      project.status = "expired";
      await project.save();
      return res.status(400).json({ message: "Project deadline passed" });
    }

    // 4. Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid contribution amount" });
    }

    // 5. Simulate payment (90% success rate)
    const paymentSuccess = Math.random() > 0.1;

    const paymentStatus = paymentSuccess ? "completed" : "failed";

    // 6. If payment failed → save failed record
    if (!paymentSuccess) {
      const failedContribution = await Contribution.create({
        projectId,
        backerId: req.user._id,
        amount,
        paymentMethod,
        paymentStatus,
        message,
        anonymous,
        rewardId: rewardId || null
      });

      return res.status(400).json({
        message: "Payment failed",
        contribution: failedContribution
      });
    }

    // 7. Create successful contribution
    const contribution = await Contribution.create({
      projectId,
      backerId: req.user._id,
      amount,
      paymentMethod,
      paymentStatus,
      message,
      anonymous,
      rewardId: rewardId || null
    });

    // 8. Update project funding
    project.currentFunding += Number(amount);

    // 9. Increase backer count
    project.backerCount += 1;

    // 10. Check if funded
    if (project.currentFunding >= project.fundingGoal) {
      project.status = "funded";
    }

    await project.save();

    res.status(201).json({
      message: "Contribution successful",
      contribution,
      project
    });

  } catch (error) {
    res.status(500).json({
      message: "Contribution failed",
      error: error.message
    });
  }
});

/**
 * GET /api/contributions/my-contributions
 * Get logged-in user contributions
 */
router.get("/my-contributions", authMiddleware, async (req, res) => {
  try {
    const contributions = await Contribution.find({
      backerId: req.user._id
    })
      .populate("projectId", "title coverImage fundingGoal currentFunding")
      .sort({ createdAt: -1 });

    res.json(contributions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch contributions"
    });
  }
});

/**
 * GET /api/contributions/project/:id
 * Only project creator can view contributions
 */
router.get("/project/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check ownership
    if (project.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const contributions = await Contribution.find({
      projectId: req.params.id
    })
      .populate("backerId", "name email")
      .sort({ createdAt: -1 });

    res.json(contributions);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch project contributions"
    });
  }
});

module.exports = router;