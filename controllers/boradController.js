import Board from "../models/Board.js";

export async function createBoard(req, res) {
  const { name, workspaceId } = req.body;

  const board = new Board({
    name,
    workspace: workspaceId,
    createdBy: req.userId,
  });

  await board.save();
  res.status(201).json(board);
}

export async function getBoardsByWorkspace(req, res) {
  const { workspaceId } = req.params;

  const boards = await Board.find({ workspace: workspaceId });
  res.json(boards);
}

export async function updateBoard(req, res) {
  const { boardId } = req.params;
  const updates = req.body;

  const board = await Board.findByIdAndUpdate(boardId, updates, { new: true });
  if (!board) return res.status(404).json({ msg: "Board not found" });

  res.json(board);
}

export async function deleteBoard(req, res) {
  const { boardId } = req.params;

  const board = await Board.findById(boardId);
  if (!board) return res.status(404).json({ msg: "Board not found" });

  if (board.createdBy.toString() !== req.userId) {
    return res.status(403).json({ msg: "Not authorized to delete this board" });
  }

  await Board.findByIdAndDelete(boardId);
  res.json({ msg: "Board deleted successfully" });
}
