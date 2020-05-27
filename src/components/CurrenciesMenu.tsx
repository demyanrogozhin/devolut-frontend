import React from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export type MenuItem = {
  value: string,
  label?: string
}

export interface CurrencyMenuProps {
  anchorEl: Element | ((element: Element) => Element) | null | undefined,
  onClose: () => void,
  open: boolean,
  currencies?: MenuItem[],
  currency: string,
  onClick: (value: string) => void
}

export const CurrenciesMenu = React.memo(function CurrenciesMenuComponent(props: CurrencyMenuProps): React.ReactElement {
  const {
    anchorEl,
    onClose,
    open,
    currencies,
    currency,
    onClick
  } = props;
  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={open}
      onClose={onClose}>
      {(currencies || []).map((option: MenuItem) => (
        <MenuItem
          key={ option.value }
          selected={ option.value === currency }
          onClick={() => onClick(option.value)}
          >
          {option.value} {option.label}
        </MenuItem>
      ))}
    </Menu>)
}, ( prevProps, nextProps ) => !nextProps.anchorEl && !prevProps.anchorEl );
