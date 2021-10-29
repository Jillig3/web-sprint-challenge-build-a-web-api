// Write your "projects" router here!
const express = require('express');
const {
    handleError,
} = require('./projects-middleware');
const Projects = require('./projects-model');
const Actions = require('../actions/actions-model');

const router = express.Router();

router.get('/', (req, res, next) => {
    Projects.get()
    .then(projects => {
        res.status(200).json(projects);
    })
    .catch(next);
});

router.get('/:id', (req, res) => {
    Projects.get(req.params.id)
    .then(projects => {
        if (projects) {
            res.status(200).json(projects);
        } else {
            res.status(404).json({ 
                message: "The project with the specified ID does not exist"
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: "The Project information could not be retrieved"
        })
    })
})

router.post('/', async (req, res) => {
    const { name, description } = req.body
    if (!name || !description) {
        res.status(400).json({
            message: "Please provide name and description for the project"
        })
    } else {
        Projects.insert({ name, description})
        .then(({ id }) => {
            return Projects.get(id)
        })
        .then(project => {
            res.status(201).json(project)
        })
        .catch(err => {
            res.status(500).json({
                message: "There was an error saving your project",
                err: err.message,
                stack: err.stack,
            })
        })
    }
})

router.put('/:id', async (req, res) => {
    const { name, description } = req.body
    if (!name || !description) {
        res.status(400).json({
            message: "Please provide name and description for the project"
        })
    }else {
        Projects.get(req.params.id)
        .then(info => {
            if (!info) {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist',
                })
            } else {
                return Projects.update(req.params.id, req.body)
            }
        })
        .then(data => {
            if (data) {
                return Projects.get(req.params.id)
            }
        })
        .then(project => {
            res.json(project)
        })
        .catch(err => {
            res.status(500).json({
                message: 'The posts information could not be retrieved',
                err: err.message,
                stack: err.stack,
            })
        })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const projects = await Projects.get(req.params.id)
        if (!projects) {
            res.status(404).json({
                message: 'The project with the specified ID does not exist',
            })
        } else {
            await Projects.remove(req.params.id)
            res.json(projects)
        }
    } catch(err) {
        res.status(500).json({
            message: "The project could not be removed",
            err: err.message,
            stack: err.stack,
        })
    }
})

router.get('/:id/actions', async (req, res,) => {
    try {
        const project = await Projects.get(req.params.id)
        if (!project) {
            res.status(404).json({
                message: 'The project with the specified does not exist',
            })
        } else {
            const actions = await Projects.getProjectActions(req.params.id)
            res.json(actions)
        }
    } catch (err) {
        res.status(500).json({
            message: 'The actions information could not be retrieved',
            err: err.message,
            stack: err.stack,
        })
    }
})

router.use(handleError);
module.exports = router;