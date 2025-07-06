import Task from "../models/Task.js";

export async function createTask(req, res) {
  const { title, description, columnId, boardId, assignedTo, dueDate } =
    req.body;

  const task = new Task({
    title,
    description,
    column: columnId,
    board: boardId,
    assignedTo,
    dueDate,
    attachments: [],
    comments: [],
    order: 0, // Default order, can be updated later
  });

  await task.save();
  res.status(201).json(task);
}

export async function getTasksByColumn(req, res) {
  const { columnId } = req.params;

  const tasks = await find({ column: columnId })
    .sort("order")
    .populate("assignedTo", "name email");
  res.json(tasks);
}

export async function updateTask(req, res) {
  const { taskId } = req.params;
  const updates = req.body;

  const task = await findByIdAndUpdate(taskId, updates, { new: true });
  res.json(task);
}

export async function moveTask(req, res) {
  const { taskId, newColumnId, newOrder } = req.body;

  const task = await findById(taskId);
  if (!task) return res.status(404).json({ msg: "Task not found" });

  task.column = newColumnId;
  task.order = newOrder;

  await task.save();
  res.json(task);
}

export async function addComment(req, res) {
  const { taskId } = req.params;
  const { userId, text } = req.body;
  const task = await findById(taskId);
  if (!task) return res.status(404).json({ msg: "Task not found" });

  const comment = {
    user: userId,
    text,
    createdAt: new Date(),
  };

  task.comments.push(comment);
  await task.save();
  res.json(task);
}

export async function addAttachment(req, res) {
  const { taskId } = req.params;
  const { filename, url } = req.body;

  const task = await findById(taskId);
  if (!task) return res.status(404).json({ msg: "Task not found" });
  const attachment = {
    filename,
    url,
    uploadedAt: new Date(),
  };

  task.attachments.push(attachment);
  await task.save();
  res.json(task);
}

export async function deleteTask(req, res) {
  const { taskId } = req.params;
  const task = await findByIdAndDelete(taskId);
  if (!task) return res.status(404).json({ msg: "Task not found" });

  res.json({ msg: "Task deleted successfully" });
}
