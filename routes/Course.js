// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
    createCourse,
    getAllCourses,
    getCourseDetails,
  } = require("../controllers/Course")

  // Categories Controllers Import
  const {
    createCategory,
    showAllCategory,
    CategoryDetails,
  } = require("../controllers/Category")

  // Sections Controllers Import
  const {  
    createSection,
    updateSection, 
    deleteSection,
  } = require("../controllers/Section")

  // Sub-Section Controllers Import
  const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
  } = require("../controllers/Subsection")

  const {
    createRatingAndReview,
    avgRating,
    getAllRating,
  } = require("../controllers/RatingAndReview")

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************
// Courses can Only be Created by Instructors 
router.post("/createCourse",auth,isInstructor,createCourse)
router.get("/getAllCourses",getAllCourses)
router.get("/getCourseDetails",getCourseDetails)
// Add a section
router.post("/addSection",auth,isInstructor,createSection)
router.post("/updateSection",auth,isInstructor,updateSection)
router.post("/deleteSection",auth,isInstructor,deleteSection)

// Subsection
router.post("/addSubSection",auth,isInstructor,createSubSection)
router.post("/updateSubSection",auth,isInstructor,updateSubSection)
router.post("/deleteSubSection",auth,isInstructor,deleteSubSection)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategory)
router.post("/getCategoryPageDetails", CategoryDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRatingAndReview)
router.get("/getAverageRating", avgRating)
router.get("/getReviews", getAllRating)
module.exports = router