import React, { FC, useState } from 'react';
import { css } from 'emotion';
import {
  Badge,
  BadgeColor,
  Button,
  Container,
  ConfirmModal,
  Legend,
  IconName,
  stylesFactory,
  useTheme,
} from '@grafana/ui';
import { Probe, OrgRole } from 'types';
import { hasRole } from 'utils';
import { UptimeGauge } from './UptimeGauge';
import { GrafanaTheme } from '@grafana/data';

interface Props {
  probe: Probe;
  onResetToken: () => void;
}

interface BadgeStatus {
  color: BadgeColor;
  text: string;
  icon: IconName;
}

const getStyles = stylesFactory((theme: GrafanaTheme) => ({
  legend: css`
    margin: ${theme.spacing.sm} ${theme.spacing.sm} 0 0;
    width: auto;
  `,
  container: css`
    padding-left: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.md};
  `,
  badgeContainer: css`
    margin-bottom: ${theme.spacing.sm};
    display: flex;
    align-items: center;
  `,
}));

const getBadgeStatus = (online: boolean): BadgeStatus => {
  if (online) {
    return {
      text: 'Online',
      color: 'green',
      icon: 'heart',
    };
  }
  return {
    text: 'Offline',
    color: 'red',
    icon: 'heart-break',
  };
};

const ProbeStatus: FC<Props> = ({ probe, onResetToken }) => {
  const [showResetModal, setShowResetModal] = useState(false);
  const theme = useTheme();

  if (!probe) {
    return null;
  }
  const isEditor = !probe.public && hasRole(OrgRole.EDITOR);
  const badgeStatus = getBadgeStatus(probe.online);

  const styles = getStyles(theme);

  const handleResetToken = () => {
    onResetToken();
    setShowResetModal(false);
  };

  return (
    <Container margin="md">
      <div className={styles.container}>
        <div className={styles.badgeContainer}>
          <Legend className={styles.legend}>Status:</Legend>
          <Badge color={badgeStatus.color} icon={badgeStatus.icon} text={badgeStatus.text} />
        </div>
        {!probe.public && (
          <Container>
            <Button variant="destructive" onClick={() => setShowResetModal(true)} disabled={!isEditor}>
              Reset Access Token
            </Button>
            <ConfirmModal
              isOpen={showResetModal}
              title="Reset Probe Access Token"
              body="Are you sure you want to reset the access token for this Probe?"
              confirmText="Reset Token"
              onConfirm={handleResetToken}
              onDismiss={() => setShowResetModal(false)}
            />
          </Container>
        )}
      </div>
      <UptimeGauge labelNames={['probe']} labelValues={[probe.name]} height={200} width={300} sparkline={true} />
    </Container>
  );
};

export default ProbeStatus;
