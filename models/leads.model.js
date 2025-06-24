const mongoose = require('mongoose')

const LeadsSchema = new mongoose.Schema({
    fullname: { type: String, required: true},
    leadsource: { type: String, enum: ["Website", "Referral", "Cold Call"], required: true},
    salesagent: { type: mongoose.Schema.Types.ObjectId, ref: "SalesAgent", required: true},
    leadstatus: { type: String, enum: ["New", "Contacted", "Qualified", "Proposal Sent", "Closed-Won", "Closed-Lost"], default: "New"},
    priority: { type: String, enum: ["High", "Medium", "Low"], default: 'Medium', required: true},
    timetoclose: { type: Number, required: true, min: 1},
    tags: [{ type: String, enum: ["High Value", "Follow-up"], required: true}],
    leadid: { type: String, unique: true, required: true}
},
{
    timestamps: true
}
)

const Leads = mongoose.model("Leads", LeadsSchema)

module.exports = Leads