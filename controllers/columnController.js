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

export async function updateColumnName(req, res) {
  const { columnId } = req.params;
  const { name } = req.body;

  const column = await findByIdAndUpdate(columnId, { name }, { new: true });
  if (!column) return res.status(404).json({ msg: "Column not found" });

  res.json(column);
}

export async function deleteColumn(req, res) {
  const { columnId } = req.params;

  const column = await Column.find({ _id: columnId });
  if (!column) return res.status(404).json({ msg: "Column not found" });

  await Column.findByIdAndDelete(columnId);
  res.json({ msg: "Column deleted successfully" });
}
