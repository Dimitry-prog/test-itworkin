import { FormEvent, ReactNode } from 'react';

type FormProps = {
  content: ReactNode;
  onSubmit: (event: FormEvent) => void;
};

const Form = ({ content, onSubmit }: FormProps) => {
  return (
    <form onSubmit={onSubmit} className="p-4 border border-orange-200 rounded-md">
      {content}
    </form>
  );
};

export default Form;
