import Column from "../models/Column.js";

export async function createColumn(req, res) {
  const { name, boardId, order } = req.body;

  const column = new Column({
    name,
    board: boardId,
    order,
  });

  await column.save();
  res.status(201).json(column);
}

export async function getColumnsByBoard(req, res) {
  const { boardId } = req.params;

  const columns = await find({ board: boardId }).sort("order");
  res.json(columns);
}

export async function updateColumnOrder(req, res) {
  const { columnId, newOrder } = req.body;

  const column = await findByIdAndUpdate(
    columnId,
    { order: newOrder },
    { new: true }
  );
  res.json(column);
}
