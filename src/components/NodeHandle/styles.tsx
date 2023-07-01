import styled from 'styled-components'
import { Handle } from 'reactflow'

export const EditIconContainer = styled.div`
  width: 12px;
  color: #ccc;
  opacity: 0;
  cursor: pointer;
`

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 3px 0;

  &:hover {
    ${EditIconContainer} {
      color: #333;
      opacity: 1;
    }
  }
`

export const HandleIndicator = styled(Handle)`
  position: relative;
  top: 0;
  width: 9px;
  height: 15px;
  left: 0;
  cursor: crosshair;
  border: none;
`
