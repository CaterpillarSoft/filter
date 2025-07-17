import { Input, Tag } from 'antd'
import styled from 'styled-components'

export const FilterContainer = styled.div`
  .multiple-filter {
    width: 100%;
  }
`

export const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const InputWrapper = styled.div`
  position: relative;
  flex: 1;
`

export const PopoverContent = styled.div`
  width: 320px;
`

export const SearchInput = styled(Input)`
  margin-bottom: 8px;
`

export const OptionsList = styled.div`
  max-height: 192px;
  overflow-y: auto;
`

export const OptionItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background-color: #f5f5f5;
  }
`

export const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`

export const FilterTitle = styled.h4`
  font-weight: 500;
  margin: 0;
`

export const MultiSelectContainer = styled.div`
  max-height: 192px;
  overflow-y: auto;
`

export const MultiSelectFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const SelectedCount = styled.span`
  font-size: 14px;
  color: #666;
`

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`

export const DisabledTag = styled(Tag)`
  opacity: 0.7;
`

export const CursorInput = styled(Input)`
  cursor: pointer;
`

export const NoResultsMessage = styled.div`
  padding: 12px;
  text-align: center;
  color: #999;
`
