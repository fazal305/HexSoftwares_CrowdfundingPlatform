const express = require("express");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all projects with filters, search, sorting, and pagination
router.get("/", async (req, res) => {
  try {
    const {
      category,
      search,
      status,
      sort = "newest",
      page = 1,
      limit = 6
    } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i"
          }
        },
        {
          description: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    if (sort === "funding") {
      sortOption = { currentFunding: -1 };
    }

    const projects = await Project.find(query)
      .populate("creatorId", "name email")
      .sort(sortOption)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const totalProjects = await Project.countDocuments(query);

    res.json({
      projects,
      totalProjects,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProjects / Number(limit))
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects"
    });
  }
});

// Get featured projects
router.get("/featured", async (req, res) => {
  try {
    const projects = await Project.find({
      status: "active"
    })
      .populate("creatorId", "name")
      .sort({ currentFunding: -1 })
      .limit(4);

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch featured projects"
    });
  }
});

// Get current user's projects
router.get("/my-projects", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({
      creatorId: req.user._id
    }).sort({
      createdAt: -1
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user projects"
    });
  }
});

// Get project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("creatorId", "name email bio");

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch project"
    });
  }
});

// Create project
router.post("/", authMiddleware, async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      creatorId: req.user._id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create project"
    });
  }
});

// Update project
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    if (project.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    Object.assign(project, req.body);

    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update project"
    });
  }
});

// Cancel project
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    if (project.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    project.status = "cancelled";

    await project.save();

    res.json({
      message: "Project cancelled successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel project"
    });
  }
});

module.exports = router;