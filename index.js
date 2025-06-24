const { initializeLeadsData } = require('./db/db.connect')

initializeLeadsData()

const Leads = require('./models/leads.model')
const SalesAgent = require('./models/salesagent.model')
const Comment = require('./models/comment.model')
const express = require("express");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})



// Leads API

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
    const savedLead = await saveLead.save();
    return savedLead;
  } catch (error) {
    console.log('Error while adding Leads', error);
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
    let leads;

    if (status) {
      leads = await Leads.find({ leadstatus: status }).populate("salesAgent");
    } else {
      leads = await Leads.find().populate("salesAgent");
    }

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
    const getLeadsByIdAndUpdate = await Leads.findByIdAndUpdate(leadId, dataToUpdate, { new: true})
    return getLeadsByIdAndUpdate
  } catch (error) {
    console.log("Error while updating lead details!", error)
  }
}

app.post("/v1/leads/:id", async (req, res) => {
  try {
    const updatedLead = await updateLead(req.params.id, req.body)
    if(updatedLead) {
      res.json({ message: "Lead Updated Successfully.", leads: updatedLead})
    } else {
      res.status(404).json({ error: "Lead Not Found!"})
    }
  } catch (error) {
    res.status(500).json({ error: "Failed To Update Lead Details!"})
  }
})



// SalesAgent API

async function addAgents(newAgent) {
  try {
    const addNewAgent = new SalesAgent(newAgent)
    const saveAgent = await addNewAgent.save()
    return saveAgent
  } catch (error) {
    console.log("Error While Adding New Agents!", error)
  }
}

app.post("/v1/agents", async (req, res) => {
  try {
    const savedAgents = await addAgents(req.body)
    res.status(201).json({ message: "Agent Added Successfully.", agent: savedAgents})
  } catch (error) {
    res.status(500).json({ error: "Error occured while adding new agent!"})
  }
})


async function getAllAgents() {
  try {
    const allAgents = await SalesAgent.find()
    return allAgents
  } catch(error) {
    console.log("Error while fetching all Agents!", error)
  }
}


app.get("/v1/agents", async (req, res) => {
  try {
    const getallagents = await getAllAgents()
    if(getallagents.length != 0) {
      res.json(getallagents)
    } else {
      res.status(404).json({ error: "Agent Not Found!"})
    }
  } catch (error) {
    res.status(500).json({ error: "Error occured while fetching all agents!"})
  }
})


async function updateAgentDetails(agentsId, dataToUpdate) {
  try {
    const findAgentByIdAndUpdate = await SalesAgent.findByIdAndUpdate(agentsId, dataToUpdate, {new: true})
    return findAgentByIdAndUpdate
  } catch (error) {
    console.log("Error while updateding Agent Details!", error)
  }
}

app.post("/v1/agents/:id", async (req, res) => {
  try {
    const updatedAgent = updateAgentDetails(req.params.id, req.body)
    if(updatedAgent) {
      res.json({ message: "Agent Details Updated Successfully!"})
    } else {
      res.status(404).json({ error: "Error while updating agent details!"})
    }
  } catch(error) {
    res.status(500).json({ error: "Error Occured While Updating Agent Details!"})
  }
})


async function deleteAgent(agentId) {
  try {
    const findAndDeleteAgent = await SalesAgent.findByIdAndDelete(agentId)
    return findAndDeleteAgent
  } catch (error) {
    console.log("Error while deleting agent!", error)
  }
}

app.delete("/v1/agents/delete/:id", async (req, res) => {
  try {
    const deletedAgent = await deleteAgent(req.params.id)
    if(deletedAgent) {
      res.json({ message: "Agent Deleted Successfully."})
    } else {
      res.status(404).json({ error: "Agent Not Found!"})
    }
  } catch (error) {
    res.status(500).json({ error: "Error Occured While Deleting Agent!" })
  }
})


// Comment API
async function addComments(newComment) {
  try {
    const addNewComment = new Comment(newComment)
    const saveComment = await addNewComment.save()
    return saveComment
  } catch (error) {
    console.log("Error While Adding New Comment!", error)
  }
}

app.post("/v1/comments", async (req, res) => {
  try {
    const savedComments = await addComments(req.body)
    res.status(201).json({ message: "Comment Added Successfully.", comment: savedComments})
  } catch (error) {
    res.status(500).json({ error: "Error occured while adding new comment!"})
  }
})


async function getAllComments() {
  try {
    const allComment = await Comment.find()
    return allComment
  } catch(error) {
    console.log("Error while fetching all Comments!", error)
  }
}


app.get("/v1/comments", async (req, res) => {
  try {
    const getallcomments = await getAllComments()
    if(getallcomments.length != 0) {
      res.json(getallcomments)
    } else {
      res.status(404).json({ error: "Comment Not Found!"})
    }
  } catch (error) {
    res.status(500).json({ error: "Error occured while fetching all Comments!"})
  }
})