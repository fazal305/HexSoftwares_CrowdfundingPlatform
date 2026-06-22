const express = require("express");
const Update = require("../models/Update");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * POST /api/updates
 * Create project update (creator only)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { projectId, title, content } = req.body;

    // 1. Check project exists
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 2. Check ownership
    if (project.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 3. Create update
    const update = await Update.create({
      projectId,
      creatorId: req.user._id,
      title,
      content
    });

    res.status(201).json({
      message: "Update posted successfully",
      update
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create update",
      error: error.message
    });
  }
});

/**
 * GET /api/updates/project/:id
 * Public - view all updates of a project
 */
router.get("/project/:id", async (req, res) => {
  try {
    const updates = await Update.find({
      projectId: req.params.id
    })
      .populate("creatorId", "name email")
      .sort({ createdAt: -1 });

    res.json(updates);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch updates"
    });
  }
});

/**
 * DELETE /api/updates/:id
 * Creator only - delete update
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const update = await Update.findById(req.params.id);

    if (!update) {
      return res.status(404).json({ message: "Update not found" });
    }

    // Check ownership
    if (update.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await update.deleteOne();

    res.json({
      message: "Update deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete update"
    });
  }
});

module.exports = router;