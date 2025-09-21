const express = require('express')
const  router = express.Router()
const {createDocument,deleteDocument,updateDocument,getDocumentById,getUserDocuments,searchDocuments,getVersions,restoreVersion,deleteVersion} = require('../Controllers/DocController')
const AuthMiddleware = require ('../Middleware/AuthMiddleware')
const {addCollaborator, removeCollaborator, getCollaborators} = require('../Controllers/CollaboratorController')

router.post('/create',AuthMiddleware,createDocument);
router.put('/update/:id',AuthMiddleware,updateDocument);
router.delete('/delete/:id',AuthMiddleware,deleteDocument);
router.get('/all',AuthMiddleware,getUserDocuments);
router.get("/search", AuthMiddleware, searchDocuments);
router.get('/:id',AuthMiddleware,getDocumentById);
router.post('/:id/add-Collaborator',AuthMiddleware,addCollaborator);
router.delete('/:id/remove-Collaborator',AuthMiddleware,removeCollaborator);
router.get("/:id/collaborators", AuthMiddleware, getCollaborators);
router.get("/:id/versions", AuthMiddleware, getVersions);
router.put("/:id/versions/:versionId/restore", AuthMiddleware, restoreVersion);
router.delete("/:id/versions/:versionId", AuthMiddleware, deleteVersion);

module.exports = router;