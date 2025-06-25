const express = require("express");
const cors = require("cors");
const Leads = require("./models/leads.model");
const SalesAgent = require("./models/salesagent.model");
const Comment = require("./models/comment.model");
const { initializeLeadsData } = require("./db/db.connect");

initializeLeadsData();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://crm-frontend-seven-puce.vercel.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});



// const jsonData = fs.readFileSync('leads_data.json', 'utf-8')

// const leadsData = JSON.parse(jsonData)

// function seedData () {
//     try {
//         for(const leadData of leadsData){
//             const newLeadsData = new Leads({
//                 fullname: leadData.fullname,
//                 leadsource: leadData.leadsource,
//                 salesagent: leadData.salesagent,
//                 leadstatus: leadData.leadstatus,
//                 priority: leadData.priority,
//                 timetoclose: leadData.timetoclose,
//                 tags: leadData.tags,
//                 leadid: leadData.leadid
//             })

//             newLeadsData.save()
//         }
//     } catch (error) {
//         console.log("Error seeding Leads.", error)
//     }
// }

// seedData()


// ========== Leads API ==========

function generateRandom6DigitId() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function addLeads(newLead) {
  try {
    let leadid;
    let exists = true;

    while (exists) {
      leadid = generateRandom6DigitId();
      const existing = await Leads.findOne({ leadid });
      if (!existing) exists = false;
    }

    newLead.leadid = leadid;

    const saveLead = new Leads(newLead);
    return await saveLead.save();
  } catch (error) {
    console.log("Error while adding Leads", error);
  }
}

app.post("/v1/leads", async (req, res) => {
  try {
    const addedLead = await addLeads(req.body);
    res.status(201).json({ message: "Lead Added Successfully.", lead: addedLead });
  } catch (error) {
    res.status(500).json({ error: "Error while adding leads!" });
  }
});

app.get("/v1/leads", async (req, res) => {
  try {
    const { status } = req.query;
    const leads = status
      ? await Leads.find({ leadstatus: status }).populate("salesagent")
      : await Leads.find().populate("salesagent");

    if (leads.length !== 0) {
      res.json(leads);
    } else {
      res.status(404).json({ error: "Leads Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get leads!" });
  }
});

async function updateLead(leadId, dataToUpdate) {
  try {
    return await Leads.findByIdAndUpdate(leadId, dataToUpdate, { new: true });
  } catch (error) {
    console.log("Error while updating lead details!", error);
  }
}

app.post("/v1/leads/:id", async (req, res) => {
  try {
    const updatedLead = await updateLead(req.params.id, req.body);
    if (updatedLead) {
      res.json({ message: "Lead Updated Successfully.", leads: updatedLead });
    } else {
      res.status(404).json({ error: "Lead Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed To Update Lead Details!" });
  }
});

// ========== Sales Agent API ==========

async function addAgents(newAgent) {
  try {
    const addNewAgent = new SalesAgent(newAgent);
    return await addNewAgent.save();
  } catch (error) {
    console.log("Error While Adding New Agents!", error);
  }
}

app.post("/v1/agents", async (req, res) => {
  try {
    const savedAgents = await addAgents(req.body);
    res.status(201).json({ message: "Agent Added Successfully.", agent: savedAgents });
  } catch (error) {
    res.status(500).json({ error: "Error occurred while adding new agent!" });
  }
});

app.get("/v1/agents", async (req, res) => {
  try {
    const allAgents = await SalesAgent.find();
    if (allAgents.length !== 0) {
      res.json(allAgents);
    } else {
      res.status(404).json({ error: "Agent Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error occurred while fetching all agents!" });
  }
});

async function updateAgentDetails(agentsId, dataToUpdate) {
  try {
    return await SalesAgent.findByIdAndUpdate(agentsId, dataToUpdate, { new: true });
  } catch (error) {
    console.log("Error while updating Agent Details!", error);
  }
}

app.post("/v1/agents/:id", async (req, res) => {
  try {
    const updatedAgent = await updateAgentDetails(req.params.id, req.body);
    if (updatedAgent) {
      res.json({ message: "Agent Details Updated Successfully!" });
    } else {
      res.status(404).json({ error: "Error while updating agent details!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error occurred while updating agent details!" });
  }
});

async function deleteAgent(agentId) {
  try {
    return await SalesAgent.findByIdAndDelete(agentId);
  } catch (error) {
    console.log("Error while deleting agent!", error);
  }
}

app.delete("/v1/agents/delete/:id", async (req, res) => {
  try {
    const deletedAgent = await deleteAgent(req.params.id);
    if (deletedAgent) {
      res.json({ message: "Agent Deleted Successfully." });
    } else {
      res.status(404).json({ error: "Agent Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error occurred while deleting agent!" });
  }
});

// ========== Comment API ==========

async function addComments(newComment) {
  try {
    const addNewComment = new Comment(newComment);
    return await addNewComment.save();
  } catch (error) {
    console.log("Error While Adding New Comment!", error);
  }
}

app.post("/v1/comments", async (req, res) => {
  try {
    const savedComments = await addComments(req.body);
    res.status(201).json({ message: "Comment Added Successfully.", comment: savedComments });
  } catch (error) {
    res.status(500).json({ error: "Error occurred while adding new comment!" });
  }
});

app.get("/v1/comments", async (req, res) => {
  try {
    const allComments = await Comment.find();
    if (allComments.length !== 0) {
      res.json(allComments);
    } else {
      res.status(404).json({ error: "Comment Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error occurred while fetching all comments!" });
  }
});


module.exports = app;
