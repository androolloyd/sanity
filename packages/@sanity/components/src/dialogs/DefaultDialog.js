/* eslint-disable complexity */
import PropTypes from 'prop-types'
import React from 'react'
import CloseIcon from 'part:@sanity/base/close-icon'
import styles from 'part:@sanity/components/dialogs/default-style'
import Button from 'part:@sanity/components/buttons/default'
import {Portal} from '../utilities/Portal'
import Escapable from '../utilities/Escapable'
import CaptureOutsideClicks from '../utilities/CaptureOutsideClicks'
import Stacked from '../utilities/Stacked'

export default class DefaultDialog extends React.Component {
  static propTypes = {
    kind: PropTypes.oneOf(['default', 'warning', 'success', 'danger', 'info']),
    className: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.node,
    onOpen: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    onAction: PropTypes.func,
    showHeader: PropTypes.bool,
    showCloseButton: PropTypes.bool,
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        tooltip: PropTypes.string,
        kind: PropTypes.string,
        autoFocus: PropTypes.bool
      })
    )
  }

  static defaultProps = {
    showHeader: false,
    showCloseButton: true,
    onAction() {},
    onOpen() {},
    actions: [],
    kind: 'default'
  }

  openDialogElement() {
    this.props.onOpen()
  }

  handleDialogClick = event => {
    event.stopPropagation()
  }

  setDialogElement = element => {
    this.dialog = element
  }

  renderActions = actions => {
    if (!actions || actions.length < 1) {
      return undefined
    }

    return (
      <div className={styles.actions}>
        {actions.map((action, i) => {
          return (
            <Button
              key={i}
              onClick={() => this.props.onAction(action)}
              data-action-index={i}
              color={action.color}
              disabled={action.disabled}
              kind={action.kind}
              autoFocus={action.autoFocus}
              className={action.secondary ? styles.actionSecondary : ''}
            >
              {action.title}
            </Button>
          )
        })}
      </div>
    )
  }

  render() {
    const {title, actions, showHeader, kind, onClose, className, showCloseButton} = this.props
    const classNames = `
      ${styles[kind]}
      ${styles.isOpen}
      ${showHeader ? styles.hasHeader : ''}
      ${actions && actions.length > 0 ? styles.hasFunctions : ''}
      ${className}
    `

    return (
      <Portal>
        <Stacked>
          {isActive => (
            <div className={classNames}>
              <div className={styles.dialog}>
                <Escapable onEscape={event => (isActive || event.shiftKey) && onClose()} />
                <CaptureOutsideClicks onClickOutside={isActive ? onClose : undefined}>
                  <div className={styles.inner}>
                    {!showHeader &&
                      onClose &&
                      showCloseButton && (
                        <button className={styles.closeButtonOutside} onClick={onClose}>
                          <CloseIcon color="inherit" />
                        </button>
                      )}
                    {showHeader &&
                      onClose &&
                      title && (
                        <div className={styles.header}>
                          <h1 className={styles.title}>{title}</h1>
                          <button className={styles.closeButton} onClick={onClose}>
                            <CloseIcon color="inherit" />
                          </button>
                        </div>
                      )}
                    <div className={styles.content}>{this.props.children}</div>
                    {actions &&
                      actions.length > 0 && (
                        <div className={styles.footer}>{this.renderActions(actions)}</div>
                      )}
                  </div>
                </CaptureOutsideClicks>
              </div>
            </div>
          )}
        </Stacked>
      </Portal>
    )
  }
}
