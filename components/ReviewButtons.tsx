'use client';

import { Grade } from '@/lib/types';

interface ReviewButtonsProps {
  onGrade: (grade: Grade) => void;
  labels: Record<Grade, string>;
}

export default function ReviewButtons({ onGrade, labels }: ReviewButtonsProps) {
  return (
    <div className="row" role="group" aria-label="Review grading controls">
      <button className="btn btn-muted" onClick={() => onGrade('again')}>{labels.again}</button>
      <button className="btn btn-muted" onClick={() => onGrade('hard')}>{labels.hard}</button>
      <button className="btn btn-primary" onClick={() => onGrade('good')}>{labels.good}</button>
      <button className="btn btn-primary" onClick={() => onGrade('easy')}>{labels.easy}</button>
    </div>
  );
}
