type Props = {
  params: {
    workspaceId: string;
  };
};

export default function WorkspacePage({ params }: Props) {
  return <div>Workspace: {params.workspaceId}</div>;
}
