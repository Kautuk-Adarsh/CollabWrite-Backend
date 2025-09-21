const Document = require('../Models/Document')

exports.createDocument = async (req, res)=>{
   try{
    const { title,content } = req.body

    if(!title || !content){
       return res.status(400).json({"Message":"All the fields are required"});
    }

    const newdoc = new Document({title, content , owner: req.user.id});
    await newdoc.save();
    res.status(200).json({"Message":"Document Created","Document":newdoc})
    }catch(err){
        console.error(err);
        res.status(500).json({"Message":"Problem in creating the document"})
    }

};

exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    let doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ "message": "No document Found" });
    }

    const userId = req.user.id;
 
    if (
      doc.owner.toString() !== userId &&
      !doc.collaborators.map(c => c.toString()).includes(userId) &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ "Message": "User not authorized for this document" });
    }
 
    doc.versions.push({
      title: doc.title,
      content: doc.content,
      editedBy: userId
    });

    if (doc.owner.toString() === userId || req.user.role === "admin") {
      if (title) doc.title = title;
    } else if (title) {
      return res.status(403).json({ "Message": "Collaborators cannot change the title" });
    }

    if (content) doc.content = content;

    await doc.save();
    res.status(200).json({ "Message": "Document Updated", "Document": doc });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ "Message": "Failed to update the Document" });
  }
};




exports.deleteDocument = async (req, res)=>{
    try{
    let {id} = req.params;
    let doc = await  Document.findById(id);
    
    if(!doc){
        return res.status(404).json({"Message":"Could not find the Document"});
    }
    
    if (doc.owner.toString() !== req.user.id && req.user.role !== 'admin'){
      return res.status(401).json({"Message":"Not the authorized Owner or Admin"});
    }

    await doc.deleteOne();
    res.status(200).json({"Message":"The Document has been Deleted Sucessfully"});
    }catch(err){
        console.error(err);
        return res.status(500).json({"Message":"Cannot delete the Document "})
    }
}


exports.getUserDocuments = async (req, res) => {
  try {
    let docs;
    if (req.user.role === "admin") {
      docs = await Document.find().select("-__v");
    } else {
      docs = await Document.find({
        $or: [{ owner: req.user.id }, { collaborators: req.user.id }],
      }).select("-__v");
    }

    res.status(200).json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ Message: "Error fetching documents" });
  }
};


exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await Document.findById(id)
      .populate("owner", "username email") 
      .populate("collaborators", "username email"); 

    if (!doc) {
      return res.status(404).json({ Message: "Document not found" });
    }
    if (
      req.user.role !== "admin" && doc.owner._id.toString() !== req.user.id && !doc.collaborators.includes(req.user.id) ) {
      return res.status(403).json({ Message: "Not authorized to view this document" });
    }

    res.status(200).json({
      Message: "Document fetched successfully",
      document: doc
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Message: "Error fetching document" });
  }
};


exports.searchDocuments = async (req, res) => {
  try {
    const { title, fromDate, toDate } = req.query;
    const filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    if (req.user.role === "admin") {
      
    } else {
      
      filter.$or = [
        { owner: req.user.id },
        { collaborators: req.user.id }
      ];
    }

    const docs = await Document.find(filter)
      .populate("owner", "username email")
      .select("-__v -content");

    res.status(200).json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ Message: "Error searching documents" });
  }
};


exports.getVersions = async (req, res) => {
  try {
    const { id } = req.params;

    let doc = await Document.findById(id).populate("versions.editedBy", "username email");
    if (!doc) {
      return res.status(404).json({ "Message": "Document not found" });
    }
    const userId = req.user.id;

    if (
      doc.owner.toString() !== userId &&
      !doc.collaborators.map(c => c.toString()).includes(userId) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ "Message": "Not authorized to view versions" });
    }

    res.status(200).json(doc.versions);

  } catch (err) {
    console.error(err);
    res.status(500).json({ "Message": "Error fetching versions" });
  }
};

exports.restoreVersion = async (req, res) => {
  try {
    const { id, versionId } = req.params;

    let doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ "Message": "Document not found" });
    }

    const userId = req.user.id;
    if (
      doc.owner.toString() !== userId &&
      !doc.collaborators.map(c => c.toString()).includes(userId) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ "Message": "Not authorized to restore versions" });
    }

    const version = doc.versions.id(versionId);
    if (!version) {
      return res.status(404).json({ "Message": "Version not found" });
    }
 
    doc.versions.push({
      title: doc.title,
      content: doc.content,
      editedBy: userId
    });

    doc.title = version.title;
    doc.content = version.content;

    await doc.save();

    res.status(200).json({ "Message": "Document restored to selected version", "Document": doc });

  } catch (err) {
    console.error(err);
    res.status(500).json({ "Message": "Error restoring version" });
  }
};

exports.deleteVersion = async (req,res)=>{
  try{
    const { id, versionId } = req.params;

    let doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ "Message": "Document not found" });
    }

    const userId = req.user.id;

    if (
      doc.owner.toString() !== userId &&
      !doc.collaborators.map(c => c.toString()).includes(userId) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ "Message": "Not authorized to delete versions" });
    }

    const version = doc.versions.id(versionId);
    if (!version) {
      return res.status(404).json({ "Message": "Version not found" });
    }

    version.deleteOne();

    await doc.save();

    res.status(200).json({ "Message": "Version deleted successfully" });
  }catch(err){
    console.error(err)
    return res.status(500).json({"Message":"Error deleting the Version"})
  }
}
