'use client';

import { Grade } from '@/lib/types';

export default function ReviewButtons({ onGrade }: { onGrade: (grade: Grade) => void }) {
  return (
    <div className="row">
      <button className="btn btn-muted" onClick={() => onGrade('again')}>Again</button>
      <button className="btn btn-muted" onClick={() => onGrade('hard')}>Hard</button>
      <button className="btn btn-primary" onClick={() => onGrade('good')}>Good</button>
      <button className="btn btn-primary" onClick={() => onGrade('easy')}>Easy</button>
    </div>
  );
}
