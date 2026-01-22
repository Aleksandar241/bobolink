/**
 * SVGR template used by `@svgr/cli --template`.
 *
 * Important: SVGR loads this file via Node `require()`, so it must be valid
 * plain JavaScript (no TypeScript syntax).
 */
//@ts-nocheck
module.exports = (variables, { tpl }) => {
  const componentName = variables.componentName.replace('Svg', 'Icon');

  return tpl`
    ${variables.imports};
    ${variables.interfaces};
    import { Icon, IconProps } from '@/src/components/Icon';

    const SVGIcon = (${variables.props}) => (
      ${variables.jsx}
    );

    export const ${componentName} = (props: Omit<IconProps, 'Icon'>) => {
      return <Icon {...props} Icon={SVGIcon} />;
    };
  `;
};
