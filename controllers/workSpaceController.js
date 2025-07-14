import Workspace from "../models/Workspace.js";

export async function createWorkspace(req, res) {
  const { name } = req.body;
  const ownerId = req.userId;

  const workspace = new Workspace({
    name,
    owner: ownerId,
    members: [ownerId], // creator is also member
  });

  await workspace.save();
  res.status(201).json(workspace);
}

export async function getUserWorkspaces(req, res) {
  const workspaces = await Workspace.find({
    members: req.userId,
  }).populate("members", "name email");

  res.json(workspaces);
}

export async function addMember(req, res) {
  const { workspaceId, userIdToAdd } = req.body;

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) return res.status(404).json({ msg: "Not found" });

  if (!workspace.members.includes(userIdToAdd)) {
    workspace.members.push(userIdToAdd);
    await workspace.save();
  }

  res.json(workspace);
}

export async function removeMember(req, res) {
  const { workspaceId, userIdToRemove } = req.body;

  const workspace = await findById(workspaceId);
  if (!workspace) return res.status(404).json({ msg: "Not found" });

  workspace.members = workspace.members.filter(
    (id) => id.toString() !== userIdToRemove
  );
  await workspace.save();

  res.json(workspace);
}

export async function deleteWorkspace(req, res) {
  const { workspaceId } = req.params;

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) return res.status(404).json({ msg: "Workspace not found" });

  if (workspace.owner.toString() !== req.userId) {
    return res
      .status(403)
      .json({ msg: "Not authorized to delete this workspace" });
  }

  await Workspace.findByIdAndDelete(workspaceId);
  res.json({ msg: "Workspace deleted successfully" });
}
