const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// Load environment variables
dotenv.config({ path: "./database/node_auth.env" });

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware - configured for development
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable for development
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false, // Disable CORP restrictions for development
    crossOriginOpenerPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Session configuration
app.use(
  session({
    store: new SQLiteStore({
      db: "sessions.db",
      dir: "./database/",
    }),
    secret:
      process.env.SESSION_SECRET ||
      "your-super-secret-key-change-this-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Database setup
const db = new sqlite3.Database(
  "./database/accounts.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error("Database connection error:", err.message);
      return;
    }
    console.log("✓ Database Connected");
  }
);

// Create tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      googleId TEXT UNIQUE,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT,
      userType TEXT DEFAULT 'student',
      collegeName TEXT,
      course TEXT,
      registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Courses table
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      level TEXT NOT NULL,
      duration TEXT NOT NULL,
      tags TEXT,
      creatorId INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creatorId) REFERENCES users (id)
    )
  `);

  // Mentors table
  db.run(`
    CREATE TABLE IF NOT EXISTS mentors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      expertise TEXT,
      experience TEXT,
      availability TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `);

  console.log("✓ Database tables initialized");
});

// Passport configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        db.get(
          "SELECT * FROM users WHERE googleId = ?",
          [profile.id],
          (err, row) => {
            if (err) {
              return done(err);
            }

            if (row) {
              // User exists, update last login
              db.run(
                "UPDATE users SET updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
                [row.id]
              );
              return done(null, row);
            } else {
              // Create new user
              const email =
                profile.emails && profile.emails[0]
                  ? profile.emails[0].value
                  : null;
              db.run(
                "INSERT INTO users (googleId, name, email) VALUES (?, ?, ?)",
                [profile.id, profile.displayName, email],
                function (err) {
                  if (err) {
                    return done(err);
                  }
                  db.get(
                    "SELECT * FROM users WHERE id = ?",
                    [this.lastID],
                    (err, user) => {
                      return done(null, user);
                    }
                  );
                }
              );
            }
          }
        );
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
    done(err, user);
  });
});

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Static files middleware with CORP headers
app.use(
  express.static(".", {
    setHeaders: (res, path) => {
      // Set Cross-Origin-Resource-Policy to allow cross-origin requests
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      
      if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      } else if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      } else if (path.endsWith(".ico")) {
        res.setHeader("Content-Type", "image/x-icon");
      }
    },
  })
);

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Authentication required" });
};

// Routes

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Auth routes
app.get("/auth", (req, res) => {
  res.sendFile(path.join(__dirname, "Auth Page", "auth.html"));
});

app.get("/auth1", (req, res) => {
  res.sendFile(path.join(__dirname, "Auth Page", "auth1.html"));
});

app.get("/auth2", (req, res) => {
  res.sendFile(path.join(__dirname, "Auth Page", "auth2.html"));
});

// Dashboard route
app.get("/dashboard", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "Home", "home.html"));
});

app.get("/home", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "Home", "home.html"));
});

// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth" }),
  (req, res) => {
    // Successful authentication, redirect to dashboard
    res.redirect("/home");
  }
);

// Local authentication routes
app.post(
  "/auth/signup",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, userType, collegeName, course } = req.body;
      console.log("Signup attempt for:", email);

      // Promisify database operations
      const dbGet = (sql, params) => {
        return new Promise((resolve, reject) => {
          db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });
      };

      const dbRun = (sql, params) => {
        return new Promise((resolve, reject) => {
          db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
          });
        });
      };

      try {
        // Check if user already exists
        const existingUser = await dbGet(
          "SELECT * FROM users WHERE email = ?",
          [email]
        );

        if (existingUser) {
          console.log("User already exists:", email);
          return res
            .status(400)
            .json({ error: "User already exists with this email" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log("Password hashed successfully");

        // Create new user
        const result = await dbRun(
          "INSERT INTO users (name, email, password, userType, collegeName, course) VALUES (?, ?, ?, ?, ?, ?)",
          [
            name,
            email,
            hashedPassword,
            userType || "student",
            collegeName || null,
            course || null,
          ]
        );

        console.log("User created with ID:", result.lastID);

        // Get the created user
        const user = await dbGet("SELECT * FROM users WHERE id = ?", [
          result.lastID,
        ]);

        if (!user) {
          console.error("Failed to retrieve created user");
          return res.status(500).json({ error: "Failed to retrieve user" });
        }

        // Log the user in
        req.login(user, (err) => {
          if (err) {
            console.error("Login failed:", err);
            return res.status(500).json({ error: "Login failed" });
          }
          console.log("User logged in successfully:", user.email);
          res.status(201).json({
            message: "User created successfully",
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              userType: user.userType,
            },
          });
        });
      } catch (dbError) {
        console.error("Database operation error:", dbError);
        return res
          .status(500)
          .json({ error: "Database error: " + dbError.message });
      }
    } catch (error) {
      console.error("Signup error:", error);
      res
        .status(500)
        .json({ error: "Internal server error: " + error.message });
    }
  }
);

app.post(
  "/auth/signin",
  [body("email").isEmail().normalizeEmail(), body("password").exists()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {
          if (err) {
            return res.status(500).json({ error: "Database error" });
          }

          if (!user || !user.password) {
            return res.status(401).json({ error: "Invalid credentials" });
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
          }

          // Log the user in
          req.login(user, (err) => {
            if (err) {
              return res.status(500).json({ error: "Login failed" });
            }
            res.json({
              message: "Signed in successfully",
              user: { id: user.id, name: user.name, email: user.email },
            });
          });
        }
      );
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Logout route
app.post("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Session destruction failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
});

// API Routes

// Get current user
app.get("/api/user", requireAuth, (req, res) => {
  const { password, ...userWithoutPassword } = req.user;
  res.json({ user: userWithoutPassword });
});

// Update user profile
app.put(
  "/api/user/profile",
  requireAuth,
  [
    body("name").optional().trim().isLength({ min: 2 }),
    body("collegeName").optional().trim(),
    body("course").optional().trim(),
    body("userType").optional().isIn(["student", "senior", "alumni"]),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, collegeName, course, userType } = req.body;
    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }
    if (collegeName) {
      updateFields.push("collegeName = ?");
      updateValues.push(collegeName);
    }
    if (course) {
      updateFields.push("course = ?");
      updateValues.push(course);
    }
    if (userType) {
      updateFields.push("userType = ?");
      updateValues.push(userType);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    updateValues.push(req.user.id);

    db.run(
      `UPDATE users SET ${updateFields.join(
        ", "
      )}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues,
      function (err) {
        if (err) {
          console.error("Profile update error:", err);
          return res.status(500).json({ error: "Failed to update profile" });
        }
        res.json({ message: "Profile updated successfully" });
      }
    );
  }
);

// Course management routes
app.post(
  "/api/courses",
  requireAuth,
  [
    body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters"),
    body("description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters"),
    body("level")
      .isIn(["Beginner", "Intermediate", "Advanced"])
      .withMessage("Invalid level"),
    body("duration")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Duration is required"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, level, duration, tags } = req.body;
    const tagsJson = tags ? JSON.stringify(tags) : null;

    db.run(
      "INSERT INTO courses (title, description, level, duration, tags, creatorId) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, level, duration, tagsJson, req.user.id],
      function (err) {
        if (err) {
          console.error("Course creation error:", err);
          return res.status(500).json({ error: "Failed to create course" });
        }
        res.status(201).json({
          message: "Course created successfully",
          courseId: this.lastID,
        });
      }
    );
  }
);

// Get all courses
app.get("/api/courses", (req, res) => {
  db.all(
    `
    SELECT c.*, u.name as creatorName 
    FROM courses c 
    LEFT JOIN users u ON c.creatorId = u.id 
    ORDER BY c.createdAt DESC
  `,
    (err, courses) => {
      if (err) {
        console.error("Courses fetch error:", err);
        return res.status(500).json({ error: "Failed to fetch courses" });
      }

      // Parse tags JSON
      const coursesWithParsedTags = courses.map((course) => ({
        ...course,
        tags: course.tags ? JSON.parse(course.tags) : [],
      }));

      res.json({ courses: coursesWithParsedTags });
    }
  );
});

// Get user's courses
app.get("/api/courses/my", requireAuth, (req, res) => {
  db.all(
    "SELECT * FROM courses WHERE creatorId = ? ORDER BY createdAt DESC",
    [req.user.id],
    (err, courses) => {
      if (err) {
        console.error("User courses fetch error:", err);
        return res.status(500).json({ error: "Failed to fetch your courses" });
      }

      const coursesWithParsedTags = courses.map((course) => ({
        ...course,
        tags: course.tags ? JSON.parse(course.tags) : [],
      }));

      res.json({ courses: coursesWithParsedTags });
    }
  );
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("🔗 Available routes:");
  console.log("  GET  / - Landing page");
  console.log("  GET  /auth - Authentication page");
  console.log("  GET  /home - Dashboard (requires auth)");
  console.log("  GET  /auth/google - Google OAuth");
  console.log("  POST /auth/signup - User registration");
  console.log("  POST /auth/signin - User login");
  console.log("  GET  /api/courses - Get all courses");
  console.log("  POST /api/courses - Create course (requires auth)");
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down gracefully...");
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("✓ Database connection closed");
    }
    process.exit(0);
  });
});
