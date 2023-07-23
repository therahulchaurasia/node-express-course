let { people } = require('../data');

const getPeople = (req, res) => {
    res.status(200).json({ success: true, data: people })
}

const createPerson = (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, msg: "You couldn't even enter a value T_T" })
    }
    res.status(201).json({ success: true, person: name })
}

const createPersonPostman = (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, msg: "You couldn't even enter a value T_T" })
    }
    res.status(201).json({ success: true, data: [...people, name] })
}

const updatePerson = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    console.log(id, name);
    const person = people.find((pers) => pers.id === parseInt(id))
    if (!person) {
        return res.status(400).json({ success: false, msg: 'The given id does not exists' })
    }
    const newPeople = people.map((pers) => {
        if (pers.id === parseInt(id)) {
            pers.name = name
        }
        return pers
    })
    res.status(200).json({ success: true, data: newPeople })
}

const deletePerson = (req, res) => {
    const { id } = req.params;
    const person = people.find((pers) => pers.id === parseInt(id))
    if (!person) {
        return res.status(400).json({ success: false, msg: 'The given id does not exists' })
    }
    const newPeopleArray = people.filter((person) => person.id !== parseInt(id))
    res.status(200).json({ success: true, data: newPeopleArray })
}

module.exports = {
    getPeople,
    createPerson,
    createPersonPostman,
    updatePerson,
    deletePerson
}