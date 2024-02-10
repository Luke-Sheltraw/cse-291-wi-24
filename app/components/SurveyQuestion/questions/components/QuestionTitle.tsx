const QuestionTitle = ({ children, required, id }: { children: React.ReactNode, required: boolean, id?: string }) => {
  return (
    <legend data-required={ required } id={ id }>
      { children }
    </legend>
  );
}

export default QuestionTitle;