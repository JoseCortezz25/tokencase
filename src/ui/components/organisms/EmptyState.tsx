import { EmptyStateIcon } from '../molecules/EmptyStateIcon';

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <EmptyStateIcon variant="selection" />

      <h2 className="mb-3 text-xl leading-tight font-semibold text-gray-900">
        Select nodes in Figma to
        <br />
        start extracting
      </h2>

      <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-gray-600">
        To get started, select the nodes from which you want to extract
        color styles. The plugin will automatically detect your selection.
      </p>
    </div>
  );
}

export { EmptyState };
