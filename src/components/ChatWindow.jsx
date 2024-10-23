import React from 'react';
import {Avatar} from './Avatar';
import {QuestionForm} from './QuestionForm';

export function ChatWindow() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
        <Avatar />
        <QuestionForm />
      </div>
    </div>
  );
}
