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

  const boards = await find({ workspace: workspaceId });
  res.json(boards);
}
