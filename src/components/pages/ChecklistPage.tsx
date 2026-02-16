import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { WeddingChecklist } from '@/entities';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ChecklistPage() {
  const [tasks, setTasks] = useState<WeddingChecklist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    taskName: '',
    category: '',
    dueDate: '',
    status: 'Pending',
    description: '',
    assignedTo: ''
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const result = await BaseCrudService.getAll<WeddingChecklist>('weddingchecklist');
      setTasks(result.items);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (task: WeddingChecklist) => {
    const updatedTask = {
      ...task,
      isCompleted: !task.isCompleted,
      status: !task.isCompleted ? 'Completed' : 'Pending'
    };
    setTasks(tasks.map(t => t._id === task._id ? updatedTask : t));
    try {
      await BaseCrudService.update('weddingchecklist', {
        _id: task._id,
        isCompleted: updatedTask.isCompleted,
        status: updatedTask.status
      });
    } catch (error) {
      loadTasks();
    }
  };

  const handleAddTask = async () => {
    if (!newTask.taskName.trim()) return;
    
    const taskToAdd = {
      _id: crypto.randomUUID(),
      taskName: newTask.taskName,
      category: newTask.category || 'General',
      dueDate: newTask.dueDate || undefined,
      status: 'Pending',
      description: newTask.description || undefined,
      assignedTo: newTask.assignedTo || undefined,
      isCompleted: false
    };

    setTasks([taskToAdd, ...tasks]);
    setIsAddingTask(false);
    setNewTask({ taskName: '', category: '', dueDate: '', status: 'Pending', description: '', assignedTo: '' });

    try {
      await BaseCrudService.create('weddingchecklist', taskToAdd);
    } catch (error) {
      loadTasks();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks(tasks.filter(t => t._id !== taskId));
    try {
      await BaseCrudService.delete('weddingchecklist', taskId);
    } catch (error) {
      loadTasks();
    }
  };

  const handleUpdateTask = async (task: WeddingChecklist) => {
    setTasks(tasks.map(t => t._id === task._id ? task : t));
    setEditingTaskId(null);
    try {
      await BaseCrudService.update('weddingchecklist', task);
    } catch (error) {
      loadTasks();
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.isCompleted;
    if (filter === 'pending') return !task.isCompleted;
    return true;
  });

  const categories = Array.from(new Set(tasks.map(t => t.category).filter(Boolean)));
  const tasksByCategory = categories.reduce((acc, category) => {
    acc[category!] = filteredTasks.filter(t => t.category === category);
    return acc;
  }, {} as Record<string, WeddingChecklist[]>);

  const uncategorized = filteredTasks.filter(t => !t.category || t.category === 'General');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[100rem] mx-auto px-8 md:px-16 lg:px-24 py-16">
        <div className="mb-12">
          <h1 className="font-heading text-5xl md:text-6xl text-primary mb-4">
            Wedding Checklist
          </h1>
          <p className="font-paragraph text-lg text-primary/80">
            Track every task and milestone for your special day
          </p>
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 font-paragraph text-base transition-colors duration-300 ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'border-2 border-buttonborder text-primary hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-2 font-paragraph text-base transition-colors duration-300 ${
                filter === 'pending'
                  ? 'bg-primary text-primary-foreground'
                  : 'border-2 border-buttonborder text-primary hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-2 font-paragraph text-base transition-colors duration-300 ${
                filter === 'completed'
                  ? 'bg-primary text-primary-foreground'
                  : 'border-2 border-buttonborder text-primary hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              Completed
            </button>
          </div>
          
          <button
            onClick={() => setIsAddingTask(true)}
            className="px-6 py-2 bg-primary text-primary-foreground font-paragraph text-base hover:bg-primary/90 transition-colors duration-300 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>

        {/* Add Task Form */}
        {isAddingTask && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary p-6 mb-8"
          >
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Task name *"
                value={newTask.taskName}
                onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Category"
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
              />
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Assigned to"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
              />
            </div>
            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddTask}
                className="px-6 py-2 bg-primary text-primary-foreground font-paragraph text-base hover:bg-primary/90 transition-colors duration-300"
              >
                Add Task
              </button>
              <button
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTask({ taskName: '', category: '', dueDate: '', status: 'Pending', description: '', assignedTo: '' });
                }}
                className="px-6 py-2 border-2 border-buttonborder text-primary font-paragraph text-base hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Tasks List */}
        <div className="min-h-[400px]">
          {isLoading ? null : filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-paragraph text-lg text-primary/60">
                {filter === 'all' ? 'No tasks yet. Add your first task to get started!' : `No ${filter} tasks.`}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="font-heading text-2xl text-primary mb-4">{category}</h2>
                  <div className="space-y-3">
                    {categoryTasks.map((task) => (
                      <TaskItem
                        key={task._id}
                        task={task}
                        isEditing={editingTaskId === task._id}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTask}
                        onEdit={() => setEditingTaskId(task._id)}
                        onCancelEdit={() => setEditingTaskId(null)}
                        onUpdate={handleUpdateTask}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
              
              {uncategorized.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="font-heading text-2xl text-primary mb-4">General</h2>
                  <div className="space-y-3">
                    {uncategorized.map((task) => (
                      <TaskItem
                        key={task._id}
                        task={task}
                        isEditing={editingTaskId === task._id}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTask}
                        onEdit={() => setEditingTaskId(task._id)}
                        onCancelEdit={() => setEditingTaskId(null)}
                        onUpdate={handleUpdateTask}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function TaskItem({
  task,
  isEditing,
  onToggleComplete,
  onDelete,
  onEdit,
  onCancelEdit,
  onUpdate
}: {
  task: WeddingChecklist;
  isEditing: boolean;
  onToggleComplete: (task: WeddingChecklist) => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (task: WeddingChecklist) => void;
}) {
  const [editedTask, setEditedTask] = useState(task);

  if (isEditing) {
    return (
      <div className="bg-secondary p-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={editedTask.taskName || ''}
            onChange={(e) => setEditedTask({ ...editedTask, taskName: e.target.value })}
            className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            value={editedTask.assignedTo || ''}
            onChange={(e) => setEditedTask({ ...editedTask, assignedTo: e.target.value })}
            placeholder="Assigned to"
            className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
          />
          <input
            type="date"
            value={editedTask.dueDate ? format(new Date(editedTask.dueDate), 'yyyy-MM-dd') : ''}
            onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
            className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
          />
        </div>
        <textarea
          value={editedTask.description || ''}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          placeholder="Description"
          rows={2}
          className="w-full px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={() => onUpdate(editedTask)}
            className="px-4 py-2 bg-primary text-primary-foreground font-paragraph text-sm hover:bg-primary/90 transition-colors duration-300 flex items-center gap-2"
          >
            <Check size={16} />
            Save
          </button>
          <button
            onClick={onCancelEdit}
            className="px-4 py-2 border-2 border-buttonborder text-primary font-paragraph text-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-300 flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-6 flex items-start gap-4 ${task.isCompleted ? 'opacity-60' : ''}`}>
      <button
        onClick={() => onToggleComplete(task)}
        className="flex-shrink-0 mt-1"
      >
        {task.isCompleted ? (
          <CheckCircle2 className="w-6 h-6 text-primary" />
        ) : (
          <Circle className="w-6 h-6 text-primary" />
        )}
      </button>
      
      <div className="flex-1">
        <h3 className={`font-heading text-xl text-primary mb-2 ${task.isCompleted ? 'line-through' : ''}`}>
          {task.taskName}
        </h3>
        {task.description && (
          <p className="font-paragraph text-base text-primary/70 mb-3">
            {task.description}
          </p>
        )}
        <div className="flex flex-wrap gap-4 text-sm font-paragraph text-primary/60">
          {task.dueDate && (
            <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
          )}
          {task.assignedTo && (
            <span>Assigned to: {task.assignedTo}</span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="p-2 text-primary hover:bg-secondary transition-colors duration-300"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="p-2 text-destructive hover:bg-secondary transition-colors duration-300"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
