const mongoose = require('mongoose')

const SalesAgentSchema = new mongoose.Schema({
    fullname: { type: String, required: true},
    email: { type: String, required: true},
    agentid: { type: String, required: true}
},
{
    timestamps: true
})

const SalesAgent = mongoose.model('SalesAgent', SalesAgentSchema)

module.exports = SalesAgent