// Write your "actions" router here!
const express = require('express');
const {
    handleError,
} = require('./actions-middleware');
const Actions = require('./actions-model');
const router = express.Router()

router.get('/', (req, res, next) => {
    Actions.get()
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(next);
});

router.get('/:id', (req, res) => {
    Actions.get(req.params.id)
    .then(actions => {
        if (actions) {
            res.status(200).json(actions);
        } else {
            res.status(404).json({ message: "The actions with the specified ID does not exist" })
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "The actions information could not be retrieved"
        })
    })
})

router.post('/', async (req, res) => {
    const { description, notes, project_id } = req.body    
    if (!description || !notes || !project_id) {
        res.status(400).json({ 
            message: "Please provide description and notes for the action" 
        })
    } else {
        Actions.insert({ description, notes})
            .then(({ id }) => {
                return Actions.get(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(500).json({
                    message: "There was an error while saving the action to the database",
                    err: err.message,
                    stack: err.stack,  
                })
            })
    }
})

router.put('/:id', async (req, res) => {
    const { notes, description } = req.body
    if (!notes || !description) {
        res.status(400).json({
            message: "Please provide notes and description for the action"
        })
    }else {
        Actions.get(req.params.id)
        .then(info => {
            if (!info) {
                res.status(404).json({
                    message: 'The action with the specified ID does not exist',
                })
            } else {
                return Actions.update(req.params.id, req.body)
            }
        })
        .then(data => {
            if (data) {
                return Actions.get(req.params.id)
            }
        })
        .then(project => {
            res.json(project)
        })
        .catch(err => {
            res.status(500).json({
                message: 'The actions information could not be retrieved',
                err: err.message,
                stack: err.stack,
            })
        })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const actions = await Actions.get(req.params.id)
        if (!actions) {
            res.status(404).json({
                message: 'The action with the specified ID does not exist',
            })
        } else {
            await Actions.remove(req.params.id)
            res.json(actions)
        }
    } catch(err) {
        res.status(500).json({
            message: "The action could not be removed",
            err: err.message,
            stack: err.stack,
        })
    }
})

router.use(handleError);
module.exports = router;