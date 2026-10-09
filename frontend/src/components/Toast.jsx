import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2 } from 'lucide-react';

export default function Toast() {
  const { toast } = useShop();

  if (!toast) return null;

  return (
    <div className="toast" role="status">
      <CheckCircle2 size={16} />
      <span>{toast}</span>
    </div>
  );
}
