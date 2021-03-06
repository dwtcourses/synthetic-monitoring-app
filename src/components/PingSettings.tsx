import React, { FC, useState } from 'react';
import { css } from 'emotion';
import { Field, Select, Switch } from '@grafana/ui';
import { Collapse } from 'components/Collapse';
import { IP_OPTIONS } from './constants';
import { LabelField } from 'components/LabelField';
import { useFormContext, Controller } from 'react-hook-form';

interface Props {
  isEditor: boolean;
}

export const PingSettingsForm: FC<Props> = ({ isEditor }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { control, register } = useFormContext();
  return (
    <Collapse
      label="Advanced options"
      collapsible={true}
      onToggle={() => setShowAdvanced(!showAdvanced)}
      isOpen={showAdvanced}
    >
      <div
        className={css`
          max-width: 500px;
        `}
      >
        <LabelField isEditor={isEditor} />
        <Field label="IP version" description="The IP protocol of the ICMP request" disabled={!isEditor}>
          <Controller
            name="settings.ping.ipVersion"
            as={Select}
            control={control}
            options={IP_OPTIONS}
            rules={{ required: true }}
          />
        </Field>
        <Field
          label="Don't fragment"
          description="Set the DF-bit in the IP-header. Only works with ipV4"
          disabled={!isEditor}
        >
          <Switch
            id="ping-settings-dont-fragment"
            ref={register()}
            name="settings.ping.dontFragment"
            disabled={!isEditor}
          />
        </Field>
      </div>
    </Collapse>
  );
};
