import { Dialog, DialogTrigger } from './ToolbarDialog'
import FilterDialogContents from './FilterDialogContents'
import { FilterGroupsQueryResult } from '@/utils/types/sanity/sanity.types'

type FilterDialogProps = {
  data?: FilterGroupsQueryResult | null
}

export default function FilterDialog(props: FilterDialogProps) {
  const { filterGroups } = props.data || {}

  return (
    <Dialog>
      <DialogTrigger className="p-2 focus:ring-2 focus:ring-zinc-950 focus:ring-offset-1 focus:outline-none rounded ">
        Filters
      </DialogTrigger>
      {filterGroups && filterGroups.length > 0 && (
        <FilterDialogContents filterGroups={filterGroups} />
      )}
    </Dialog>
  )
}
