import { db } from '../lib/dbConnect.js';
import { ObjectId } from 'mongodb';

const collection = db.collection('tasks');

export const getTaskByUser = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 4;
    const query = { owner: new ObjectId(req.params.id) };
    const { status, orderBy, order } = req.query;
    const sort = orderBy ? { [orderBy]: order } : {};
    if (status) {
      query['status'] = status;
    }
    console.log('---');
    console.log(`status = ${status}`);
    console.log(`orderBy = ${orderBy}`);
    console.log(`order = ${order}`);
    console.log(`sort = ${JSON.stringify(sort)}`);
    console.log(orderBy);
    console.log(sort);
    const tasks = await collection
      .find(query)
      .sort(sort)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .toArray();
    const taskCount = await collection.count(query);
    res.status(200).json({ tasks, taskCount });
  } catch (error) {
    next({ status: 500, error });
  }
};

export const getTask = async (req, res, next) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const task = await collection.findOne(query);

    if (!task) {
      return next({ status: 404, message: 'Task not found!' });
    }

    res.status(200).json(task);

  } catch (error) {
    next({ status: 500, error });
  }
};

export const createTask = async (req, res, next) => {
  try {
    const newTask = req.body;
    newTask.owner = new ObjectId(req.user.id);
    newTask.createdAt = new Date().toISOString();
    newTask.updatedAt = new Date().toISOString();
    const task = await collection.insertOne(newTask);
    return res.status(200).json(task);

  } catch (error) {
    next({ status: 500, error });
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    console.log(req.body);
    const data = {
      $set: {
        ...req.body,
        owner: new ObjectId(req.user.id),
        updatedAt: new Date().toISOString(),
      }
    };
    const options = {
      ReturnDocument: 'after',
    };
    const updatedTask = await collection.findOneAndUpdate(query, data,
      options);
    res.status(200).json(updatedTask);
  } catch (error) {
    next({ status: 500, error });
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    await collection.deleteOne(query);
    res.status(200).json('Task has been deleted!');
  } catch (error) {
    next({ status: 500, error });
  }
};