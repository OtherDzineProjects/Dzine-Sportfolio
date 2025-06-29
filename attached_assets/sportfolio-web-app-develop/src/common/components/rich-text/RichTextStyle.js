import colors from '../../theme/foundations/colors';

const style = {
  '.input-rich-container.rich-editor': {
    '.tip-tap-toolbar': {
      border: 0,
      background: 'none',
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: '0',
      gap: '12px',
      '.tool-section': {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: '0 10px 10px 10px',
        flexGrow: 1,
        gridGap: '5px',
        svg: {
          color: '#454545'
        },
        button: {
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        },
        'input[type="color"]': {
          '-webkit-appearance': 'none',
          border: 'none',
          width: '24px',
          height: '24px',
          cursor: 'pointer'
        },
        'input[type="color"]::-webkit-color-swatch-wrapper': {
          padding: '0'
        },
        'input[type="color"]::-webkit-color-swatch': {
          border: 'none'
        }
      },
      '.tool-action': {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: '10px',
        gridGap: '5px'
      }
    },
    '.tiptap': {
      height: 'var(--editor-height)',
      overflowY: 'auto',
      padding: '0',
      table: {
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
        width: '100%',
        margin: '0',
        overflow: 'hidden',
        td: {
          minWidth: '1em',
          border: '2px solid #ced4da',
          padding: '3px 5px',
          verticalAlign: 'top',
          boxSizing: 'border-box',
          position: 'relative'
        },
        th: {
          fontWeight: 'bold',
          textAlign: 'left',
          backgroundColor: '#f1f3f5',
          minWidth: '1em',
          border: '2px solid #ced4da',
          padding: '3px 5px',
          verticalAlign: 'top',
          boxSizing: 'border-box',
          position: 'relative'
        },
        '.selectedCell:after': {
          zIndex: '2',
          position: 'absolute',
          left: '0',
          right: '0',
          top: '0',
          bottom: '0',
          background: 'rgba(200, 200, 255, 0.4)',
          pointerEvents: 'none'
        },
        '.column-resize-handle': {
          position: 'absolute',
          right: '-2px',
          top: '0',
          bottom: '-2px',
          width: '4px',
          backgroundColor: '#adf',
          pointerEvents: 'none'
        }
      }
    },
    '.tiptap ul': {
      listStyle: 'revert'
    },
    '.tiptap li': {
      listStyleType: 'circle',
      padding: '5px 10px',
      '::after': {
        width: '5px',
        height: '5px',
        background: '#000',
        position: 'absolute'
      }
    },
    '.tiptap h1': {
      fontSize: '48px'
    },
    '.tiptap h2': {
      fontSize: '36px'
    },
    '.tiptap h3': {
      fontSize: '30px'
    },
    '.tiptap h4': {
      fontSize: '24px'
    },
    '.tiptap h5': {
      fontSize: '16px'
    },
    '.tiptap p': {
      fontSize: '14px'
    },
    '.icon-menu-drop': {
      minWidth: '50px'
    },
    '.font-menu-drop': {
      minWidth: '80px'
    },
    '.heading-menu-drop': {
      minWidth: '110px'
    },
    position: 'relative',
    fieldset: {
      height: 'auto',
      padding: '5px 0px',
      width: '100%',
      background: `${colors.white} !important`,
      color: 'gray.700 !important',
      fontStyle: 'normal',
      fontWeight: '400 !important',
      border: `1px solid ${colors.gray[100]}`,
      borderRadius: '8px',
      fontSize: '16px !important',
      lineHeight: '16px',
      outline: '0',
      margin: '0',
      transition: 'all 150ms ease-in-out',
      legend: {
        marginLeft: '10px'
      },
      '::placeholder': {
        fontStyle: 'normal',
        fontWeight: '400 !important',
        fontSize: '16px !important',
        lineHeight: '16px',
        opacity: '0.3'
      },
      ':is(:disabled, :read-only)': {
        opacity: '1 !important',
        border: `1px solid ${colors.gray[100]} !important`
      },
      '&.error': {
        border: `1px solid ${colors.red[500]} !important`
      },
      ':is(:hover, :focus, .active)': {
        outline: 'none !important',
        border: `1px solid ${colors.tertiary[500]} !important`,
        transition: 'all 150ms ease-in-out !important'
      },
      'div > .tiptap.ProseMirror.ProseMirror-focused': {
        outline: 'none !important'
      }
    }
  }
};

const component = {};

export default { component, style };
