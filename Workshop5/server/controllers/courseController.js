const Course = require("../models/courseModel");

/**
 * Creates a course
 *
 * @param {*} req
 * @param {*} res
 */
const coursePost = async (req, res) => {
  let course = new Course(req.body);
  await course.save()
    .then(course => {
      res.status(201); 
      res.header({
        'location': `/api/courses/?id=${course.id}`
      });
      res.json(course);
    })
    .catch( err => {
      res.status(422);
      console.log('error while saving the course', err);
      res.json({
        error: 'There was an error saving the course'
      });
    });
};

/**
 * Get all courses or one
 *
 * @param {*} req
 * @param {*} res
 */
const courseGet = (req, res) => {
  
  const teacherId = req.query.teacher;

 
  const query = teacherId ? { teacher: teacherId } : {};

  Course.find(query)
    .populate('teacher', 'first_name last_name') 
    .then(courses => {
      res.json(courses);
    })
    .catch(err => {
      console.error("Error fetching courses:", err.message);
      res.status(422).json({ error: `Could not fetch courses: ${err.message}` });
    });
};


/**
 * Update a course
 *
 * @param {*} req
 * @param {*} res
 */
const courseUpdate = async (req, res) => {
  const { name, credits, teacher } = req.body;
  const { id } = req.params;  

  if (!id) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  try {
    
    const updatedCourse = await Course.findByIdAndUpdate(id, { name, credits, teacher }, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(updatedCourse); 
  } catch (err) {
    res.status(422).json({ error: 'Error updating the course', details: err });
  }
};


/**
 * Delete a course
 *
 * @param {*} req
 * @param {*} res
 */
const courseDelete = async (req, res) => {
  const { id } = req.query;

  
  if (!id) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  try {
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course successfully deleted' });
  } catch (err) {
    res.status(422).json({ error: 'Error deleting the course', details: err });
  }
};


module.exports = {
  coursePost,
  courseGet,
  courseUpdate,
  courseDelete
}