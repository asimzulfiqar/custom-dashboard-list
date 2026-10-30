import React, { useState, useMemo } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2, Icon, Input, Button, Tooltip } from '@grafana/ui';
import { BetreiberGroup, CustomDashboardListOptions } from '../types';
import { WellTable } from './WellTable';
import { formatMetricValue } from '../utils';

interface BetreiberAccordionProps {
  groups: BetreiberGroup[];
  options: CustomDashboardListOptions;
  isNarrow?: boolean;
}

export const BetreiberAccordion: React.FC<BetreiberAccordionProps> = ({
  groups,
  options,
  isNarrow = false,
}) => {
  const styles = useStyles2(getStyles);
  const [searchTerm, setSearchTerm] = useState('');

  // Default each operator accordion to collapsed (zuklappen)
  const defaultExpanded = options.defaultExpandedAccordions ?? false;

  // Track expanded state for each operator
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const g of groups) {
      initial[g.operatorName] = defaultExpanded;
    }
    return initial;
  });

  const toggleGroup = (operatorName: string) => {
    setExpandedMap((prev) => ({
      ...prev,
      [operatorName]: !prev[operatorName],
    }));
  };

  // Determine if all groups are currently expanded
  const allExpanded = useMemo(() => {
    if (groups.length === 0) {
      return false;
    }
    return groups.every((g) => expandedMap[g.operatorName] === true);
  }, [groups, expandedMap]);

  // Single toggle action: if all expanded -> collapse all, otherwise -> expand all
  const toggleAll = () => {
    const nextState = !allExpanded;
    const updated: Record<string, boolean> = {};
    for (const g of groups) {
      updated[g.operatorName] = nextState;
    }
    setExpandedMap(updated);
  };

  // Filter groups and devices based on search
  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) {
      return groups;
    }
    const lower = searchTerm.toLowerCase();

    return groups
      .map((group) => {
        const operatorMatches = group.operatorName.toLowerCase().includes(lower);
        const matchingWells = group.wells.filter(
          (w) =>
            w.name.toLowerCase().includes(lower) ||
            w.id.toLowerCase().includes(lower) ||
            (w.betreiberkennzahl && w.betreiberkennzahl.toLowerCase().includes(lower))
        );

        if (operatorMatches) {
          return group;
        }

        if (matchingWells.length > 0) {
          return {
            ...group,
            wells: matchingWells,
          };
        }

        return null;
      })
      .filter((g): g is BetreiberGroup => g !== null);
  }, [groups, searchTerm]);

  return (
    <div className={styles.container}>
      {/* Search & Actions Bar */}
      <div className={isNarrow ? styles.actionBarNarrow : styles.actionBar}>
        {options.searchEnabled && (
          <div className={isNarrow ? styles.searchWrapperNarrow : styles.searchWrapper}>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              placeholder="Betreiber, Station oder Kennziffer suchen..."
              prefix={<Icon name="search" />}
            />
          </div>
        )}

        <div className={isNarrow ? styles.buttonGroupNarrow : styles.buttonGroup}>
          <Tooltip content={allExpanded ? 'Alle zuklappen' : 'Alle aufklappen'} placement="top">
            <Button
              size="sm"
              variant="secondary"
              onClick={toggleAll}
              icon={allExpanded ? 'angle-double-up' : 'angle-double-down'}
              aria-label={allExpanded ? 'Alle zuklappen' : 'Alle aufklappen'}
              title={allExpanded ? 'Alle zuklappen' : 'Alle aufklappen'}
            />
          </Tooltip>
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <div className={styles.emptySearch}>
          Keine Messstellen oder Betreiber gefunden für &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <div className={styles.groupList}>
          {filteredGroups.map((group) => {
            const isExpanded = expandedMap[group.operatorName] ?? defaultExpanded;
            const consumptionDecimals = options.consumptionDecimals ?? 0;
            const format = options.numberFormat || 'de-grouped';

            return (
              <div key={group.operatorName} className={styles.groupCard}>
                {/* Accordion Header */}
                <div
                  className={isNarrow ? styles.groupHeaderNarrow : styles.groupHeader}
                  onClick={() => toggleGroup(group.operatorName)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.groupHeaderLeft}>
                    <Icon
                      name={isExpanded ? 'angle-down' : 'angle-right'}
                      size="md"
                      className={styles.chevronIcon}
                    />
                    <span className={styles.operatorTitle}>{group.operatorName}</span>
                    <span className={styles.wellCountBadge}>
                      {group.wells.length} Stationen
                    </span>
                    {group.betreiberkennzahl && (
                      <span className={styles.bzkBadge}>ID: {group.betreiberkennzahl}</span>
                    )}
                  </div>

                  <div className={isNarrow ? styles.groupHeaderRightNarrow : styles.groupHeaderRight}>
                    <span className={styles.summaryMetric}>
                      12h: <strong>{formatMetricValue(group.totalConsumption12h, format, consumptionDecimals, options.consumption12hUnit || 'm³')}</strong>
                    </span>
                    <span className={styles.summaryMetric}>
                      Jahr: <strong>{formatMetricValue(group.totalConsumptionYear, format, consumptionDecimals, options.consumptionYearUnit || 'm³')}</strong>
                    </span>
                    <div className={styles.statusSummary}>
                      <span className={styles.onlineBadge} title="Online Stationen">🟢 {group.onlineCount}</span>
                      <span className={group.offlineCount > 0 ? styles.offlineBadge : styles.offlineZeroBadge} title="Offline Stationen">
                        🔴 {group.offlineCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className={styles.groupContent}>
                    <WellTable wells={group.wells} options={options} showOperatorColumn={false} isNarrow={isNarrow} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(2)};
  `,
  actionBar: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: ${theme.spacing(1)};
  `,
  actionBarNarrow: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
    width: 100%;
  `,
  searchWrapper: css`
    flex: 1;
    min-width: 240px;
    max-width: 420px;
  `,
  searchWrapperNarrow: css`
    width: 100%;
  `,
  buttonGroup: css`
    display: flex;
    gap: ${theme.spacing(1)};
  `,
  buttonGroupNarrow: css`
    display: flex;
    gap: ${theme.spacing(1)};
    width: 100%;
  `,
  fullFlexButton: css`
    flex: 1;
  `,
  groupList: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.25)};
  `,
  groupCard: css`
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    background: ${theme.colors.background.secondary};
    overflow: hidden;
  `,
  groupHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(2)};
    padding: ${theme.spacing(1.2)} ${theme.spacing(1.5)};
    background: ${theme.colors.background.secondary};
    cursor: pointer;
    user-select: none;
    transition: background 0.15s ease-in-out;
    &:hover {
      background: ${theme.colors.action.hover};
    }
  `,
  groupHeaderNarrow: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing(1)};
    padding: ${theme.spacing(1.2)} ${theme.spacing(1.5)};
    background: ${theme.colors.background.secondary};
    cursor: pointer;
    user-select: none;
    transition: background 0.15s ease-in-out;
    &:hover {
      background: ${theme.colors.action.hover};
    }
  `,
  groupHeaderLeft: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    flex-wrap: nowrap;
    min-width: 0;
    flex: 1;
  `,
  chevronIcon: css`
    color: ${theme.colors.text.secondary};
    flex-shrink: 0;
  `,
  operatorTitle: css`
    font-size: clamp(16px, 1.1vw, 20px);
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.colors.text.primary};
  `,
  wellCountBadge: css`
    font-size: clamp(11px, 0.75vw, 13px);
    background: ${theme.colors.background.canvas};
    border: 1px solid ${theme.colors.border.weak};
    padding: 2px 7px;
    border-radius: ${theme.shape.radius.pill};
    color: ${theme.colors.text.secondary};
    white-space: nowrap;
  `,
  bzkBadge: css`
    font-size: clamp(11px, 0.75vw, 13px);
    font-family: ${theme.typography.fontFamilyMonospace};
    background: ${theme.colors.background.canvas};
    border: 1px solid ${theme.colors.border.weak};
    padding: 2px 5px;
    border-radius: 4px;
    color: ${theme.colors.text.secondary};
    white-space: nowrap;
  `,
  groupHeaderRight: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    flex-wrap: nowrap;
    flex-shrink: 0;
    white-space: nowrap;
  `,
  groupHeaderRightNarrow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-top: 6px;
    border-top: 1px solid ${theme.colors.border.weak};
    gap: ${theme.spacing(1.5)};
    flex-wrap: nowrap;
    white-space: nowrap;
    overflow-x: auto;
  `,
  summaryMetric: css`
    font-size: clamp(13px, 0.9vw, 16px);
    color: ${theme.colors.text.secondary};
    white-space: nowrap;
    strong {
      color: ${theme.colors.text.primary};
      font-family: ${theme.typography.fontFamilyMonospace};
      font-size: clamp(13px, 0.9vw, 16px);
    }
  `,
  statusSummary: css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: ${theme.typography.bodySmall.fontSize};
    white-space: nowrap;
  `,
  onlineBadge: css`
    color: ${theme.colors.success.text};
    font-weight: ${theme.typography.fontWeightMedium};
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  `,
  offlineBadge: css`
    color: ${theme.colors.error.text};
    font-weight: ${theme.typography.fontWeightMedium};
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  `,
  offlineZeroBadge: css`
    color: ${theme.colors.text.secondary};
    opacity: 0.6;
    font-weight: ${theme.typography.fontWeightRegular};
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  `,
  groupContent: css`
    padding: ${theme.spacing(1.25)};
    background: ${theme.colors.background.primary};
    border-top: 1px solid ${theme.colors.border.weak};
  `,
  emptySearch: css`
    padding: ${theme.spacing(3)};
    text-align: center;
    color: ${theme.colors.text.secondary};
    background: ${theme.colors.background.secondary};
    border-radius: ${theme.shape.radius.default};
  `,
});
