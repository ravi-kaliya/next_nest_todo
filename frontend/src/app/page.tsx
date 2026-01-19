'use client';

import { useEffect, useState } from 'react';
import { TodoAPI } from '@/lib/api';

type Todo = {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const load = async () => {
    const data = await TodoAPI.list();
    setTodos(data);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!title.trim()) return;
    await TodoAPI.create({ title, description });
    setTitle(''); setDescription('');
    load();
  };

  const toggle = async (id: string, completed: boolean) => {
    await TodoAPI.update(id, { completed: !completed });
    load();
  };

  const remove = async (id: string) => {
    await TodoAPI.remove(id);
    load();
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Next + Nest + MongoDB — Todos</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          className="border p-2 flex-1"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4" onClick={add}>Add</button>
      </div>

      <ul className="space-y-2">
        {todos.map(t => (
          <li key={t._id} className="border p-3 flex items-center justify-between">
            <div>
              <p className={`font-medium ${t.completed ? 'line-through text-gray-500' : ''}`}>{t.title}</p>
              {t.description && <p className="text-sm text-gray-600">{t.description}</p>}
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border" onClick={() => toggle(t._id, t.completed)}>
                {t.completed ? 'Undo' : 'Done'}
              </button>
              <button className="px-3 py-1 border text-red-600" onClick={() => remove(t._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
