import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement, memo } from 'react';
import { Fab, useMediaQuery, Theme,Button,ButtonProps } from '@mui/material';
import ContentAdd from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';


export type CreateButtonProps = Props & ButtonProps;


const scrollStates = {
  true: { _scrollToTop: true },
  false: {},
};

const PREFIX = 'CreateButton';

const CreateButtonClasses = {
  floating: `${PREFIX}-floating`
}

const StyledFab = (styled(Fab, {
  name: PREFIX,
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  [`&.${CreateButtonClasses.floating}`]: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 60,
    left: 'auto',
    position: 'fixed',
    zIndex: 1000,
  },
})) as unknown) as typeof Fab;

const StyledButton = styled(Button, {
  name: PREFIX,
  overridesResolver: (_props, styles) => styles.root,
})({});

export const CreateButton = (props: CreateButtonProps) => {
  const {
    className,
    icon = defaultIcon,
    scrollToTop = true,
    variant,
    children,
    ...rest
  } = props;

  const isSmall = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md')
  );

  return isSmall ? (
    <StyledFab
      component={Link}
      state={scrollStates[String(scrollToTop) as 'true'| 'false']}
      // @ts-ignore FabProps ships its own runtime palette `FabPropsColorOverrides` provoking an overlap error with `ButtonProps`
      color="primary"
      {...rest}
    >
      {icon}
      {children}
    </StyledFab>
  ) : (
    <StyledButton
      size='small'
      component={Link}
      state={scrollStates[String(scrollToTop) as 'true'| 'false']}
      variant={variant}
      {...(rest as any)}
    >
      {icon}
      {children}

    </StyledButton>
  );
};

const defaultIcon = <ContentAdd />;

interface Props {
    icon?: ReactElement;
    scrollToTop?: boolean;
}

export default CreateButton;






// export default memo(CreateButton, (prevProps, nextProps) => {
//   return (
//     prevProps.resource === nextProps.resource &&
//     prevProps.label === nextProps.label &&
//     prevProps.translate === nextProps.translate &&
//     prevProps.disabled === nextProps.disabled &&
//     isEqual(prevProps.to, nextProps.to)
//   );
// });
