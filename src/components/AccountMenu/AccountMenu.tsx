import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import {
  Globe,
  LogOut,
  Menu as MenuIcon,
  Settings,
  Sparkles,
  User,
  type LucideIcon,
} from 'lucide-react'
import './AccountMenu.css'

export interface AccountMenuItem {
  id: string
  label: string
  icon: LucideIcon
  onSelect?: () => void
  variant?: 'default' | 'danger'
}

export interface AccountMenuProps {
  items?: AccountMenuItem[]
  align?: 'left' | 'right'
}

const defaultItems: AccountMenuItem[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'hedgie-ai', label: 'Hedgie AI', icon: Sparkles },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'logout', label: 'Logout', icon: LogOut, variant: 'danger' },
]

export function AccountMenu({ items = defaultItems, align = 'right' }: AccountMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const menuId = useId()

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close()
      }
    }
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, close])

  useEffect(() => {
    if (open) itemRefs.current[0]?.focus()
  }, [open])

  const focusItem = (index: number) => {
    const count = items.length
    const next = ((index % count) + count) % count
    itemRefs.current[next]?.focus()
  }

  const handleItemKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        focusItem(index + 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        focusItem(index - 1)
        break
      case 'Home':
        event.preventDefault()
        focusItem(0)
        break
      case 'End':
        event.preventDefault()
        focusItem(items.length - 1)
        break
      case 'Tab':
        close()
        break
    }
  }

  return (
    <div className="account-menu" ref={rootRef} data-align={align}>
      <button
        type="button"
        ref={triggerRef}
        className="account-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="account-menu__avatar" aria-hidden="true" />
        <MenuIcon className="account-menu__hamburger" size={20} strokeWidth={2} aria-hidden="true" />
      </button>

      {open && (
        <div className="account-menu__panel" role="menu" id={menuId} aria-orientation="vertical">
          {items.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                ref={(node) => {
                  itemRefs.current[index] = node
                }}
                className="account-menu__item"
                data-variant={item.variant ?? 'default'}
                onClick={() => {
                  item.onSelect?.()
                  close()
                }}
                onKeyDown={(event) => handleItemKeyDown(event, index)}
              >
                <Icon className="account-menu__item-icon" size={18} strokeWidth={2} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
