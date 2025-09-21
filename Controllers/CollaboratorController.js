const Document = require('../Models/Document')

exports.addCollaborator = async (req, res)=>{
    try{
        const {id} = req.params;
        const {collaboratorId} = req.body;


        let doc = await Document.findById(id);
        if(!doc)return res.status(404).json({"Message":"Cannot find the document "});
        
        if (req.user.role !== "admin" && doc.owner.toString() !== req.user.id) {
            return res.status(401).json({ Message: "Only owner or admin can add collaborators" });
        }
        if(doc.collaborators.includes(collaboratorId)){
            return res.status(400).json({"Message":"Collaborator already included"});
        }

        doc.collaborators.push(collaboratorId)
        await doc.save()
        res.status(200).json({"Message":"Collaboraor added sucessfully","Docuent":doc});

    }
    catch(err){
        console.error(err)
        return res.status(500).josn({"Message":"Cannot add the Collaborator"})
    }
}

exports.removeCollaborator = async (req, res)=>{
    try{
        const {id} = req.params;
        const {collaboratorId} = req.body;

        let doc = await Document.findById(id);
        if(!doc)return res.status(404).json({"Message":"Cannot find the document "});
        
        if (req.user.role !== "admin" && doc.owner.toString() !== req.user.id) {
            return res.status(401).json({ Message: "Only owner or admin can remove collaborators" });
        }
        doc.collaborators = doc.collaborators.filter(
            collab => collab.toString() !== collaboratorId
        );

        await doc.save();
        res.status(200).json({"Message":"removed teh collaborator"});

      }catch(err){
        console.error(err)
        return res.status(500).json({"Message":"Cannot add the Collaborator"})
    }
}

exports.getCollaborators = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await Document.findById(id)
      .populate("collaborators", "username email")
      .populate("owner", "username email");

    if (!doc) {
      return res.status(404).json({ Message: "Document not found" });
    }

    
    if (
      req.user.role !== "admin" &&
      doc.owner._id.toString() !== req.user.id &&
      !doc.collaborators.some((c) => c._id.toString() === req.user.id)
    ) {
      return res.status(403).json({ Message: "Not authorized to view collaborators" });
    }

    res.status(200).json({
      owner: doc.owner,
      collaborators: doc.collaborators,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Message: "Error fetching collaborators" });
  }
};



