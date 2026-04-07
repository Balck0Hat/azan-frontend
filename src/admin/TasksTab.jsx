import React from 'react';
import CurrentTask from './CurrentTask';
import StatsGrid from './StatsGrid';
import FilterBar from './FilterBar';
import TaskCard from './TaskCard';

export default function TasksTab({ tasks, stats, workerStatus, currentTask, filters, onFilterChange, page, totalPages, onPageChange }) {
  return (
    <>
      <CurrentTask task={currentTask} />
      <StatsGrid stats={stats} workerStatus={workerStatus} />
      <FilterBar filters={filters} onChange={onFilterChange} />
      <div className="task-list">
        {tasks.map(t => <TaskCard key={t._id} task={t} />)}
        {tasks.length === 0 && (
          <div className="admin-empty">
            {filters.status || filters.category
              ? 'No tasks match the selected filters.'
              : 'No tasks yet. Start the worker to begin.'}
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="admin-pagination">
          <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Prev</button>
          <span>Page {page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
        </div>
      )}
    </>
  );
}
