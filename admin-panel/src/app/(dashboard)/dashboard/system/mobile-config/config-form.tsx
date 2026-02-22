'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, ToggleButtonGroup, ToggleButton, TextField } from '@mui/material';
import { ImageUpload } from '@/components/common/ImageUpload';

export type GenericFieldType =
  | 'toggle_yes_no'
  | 'toggle_on_off'
  | 'toggle_off_on'
  | 'number'
  | 'text'
  | 'textarea'
  | 'image';

export type GenericField = {
  key: string;
  label: string;
  type: GenericFieldType;
  notes: string;
  apiKey: string;
  rows?: number;
};

type ConfigFormProps = {
  config: Record<string, unknown>;
  fields: GenericField[];
  onChange: (key: string, value: number | string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
};

export function GenericConfigForm({
  config,
  fields,
  onChange,
  onSave,
  saving,
  saved,
}: ConfigFormProps) {
  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {fields.map((field: GenericField) => (
            <Box
              key={field.key}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { sm: 'flex-start' },
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-of-type': { borderBottom: 0, pb: 0 },
              }}
            >
              <Box sx={{ flex: { sm: '0 0 280px' }, minWidth: 0 }}>
                <Typography variant="body1" fontWeight={500}>
                  {field.label}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {(field.type === 'toggle_yes_no' || field.type === 'toggle_on_off' || field.type === 'toggle_off_on') && (
                  <ToggleButtonGroup
                    value={config[field.key] as 0 | 1}
                    exclusive
                    onChange={(_, v) => v != null && onChange(field.key, v)}
                    size="small"
                    color="primary"
                    sx={{
                      '& .MuiToggleButton-root': {
                        px: 2,
                        py: 1,
                        textTransform: 'none',
                        '&.Mui-selected': { fontWeight: 600 },
                      },
                    }}
                  >
                    <ToggleButton value={0}>
                      {field.type === 'toggle_yes_no' ? 'No' : field.type === 'toggle_off_on' ? 'Off' : 'Off'}
                    </ToggleButton>
                    <ToggleButton value={1}>
                      {field.type === 'toggle_yes_no' ? 'Yes' : field.type === 'toggle_off_on' ? 'On' : 'On'}
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
                {field.type === 'number' && (
                  <TextField
                    type="number"
                    value={config[field.key] ?? ''}
                    onChange={(e) => onChange(field.key, parseFloat(e.target.value) || 0)}
                    size="small"
                    sx={{ width: { xs: '100%', sm: 160 } }}
                  />
                )}
                {field.type === 'text' && (
                  <TextField
                    value={config[field.key] ?? ''}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    size="small"
                    fullWidth
                    sx={{ maxWidth: 500 }}
                  />
                )}
                {field.type === 'textarea' && (
                  <TextField
                    multiline
                    rows={field.rows ?? 4}
                    value={config[field.key] ?? ''}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    size="small"
                    fullWidth
                  />
                )}
                {field.type === 'image' && (
                  <ImageUpload
                    value={String(config[field.key] ?? '')}
                    onChange={(url) => onChange(field.key, url)}
                    helperText={field.notes ? `Notes: ${field.notes}` : undefined}
                  />
                )}
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  {field.notes ? `Notes: ${field.notes} ` : ''}(Front Desk Identification: {field.apiKey})
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button variant="contained" onClick={onSave} disabled={saving} sx={{ minWidth: 120 }}>
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

/** Wrapper that fetches, manages state, and renders a generic config form. */
type GenericSectionProps<T extends object> = {
  fetchFn: () => Promise<T>;
  updateFn: (config: T) => Promise<T>;
  fields: GenericField[];
};

export function GenericSection<T extends object>({
  fetchFn,
  updateFn,
  fields,
}: GenericSectionProps<T>) {
  const [config, setConfig] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchFn()
      .then(setConfig)
      .finally(() => setLoading(false));
  }, [fetchFn]);

  const onChange = (key: keyof T & string, value: number | string) => {
    setConfig((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  };

  const onSave = async () => {
    if (!config) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateFn(config);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) {
    return <Typography color="text.secondary">Loading...</Typography>;
  }

  return (
    <GenericConfigForm
      config={config as Record<string, unknown>}
      fields={fields}
      onChange={onChange as (key: string, value: number | string) => void}
      onSave={onSave}
      saving={saving}
      saved={saved}
    />
  );
}
