interface WorkSpaceIdPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkSpaceIdPage = ({ params }: WorkSpaceIdPageProps) => {
  return (
    <div>
      hi
      {params.workspaceId}
    </div>
  );
};

export default WorkSpaceIdPage;
