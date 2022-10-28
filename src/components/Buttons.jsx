import React, { useCallback, useMemo } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  ViewStream,
  Subject,
  Edit,
  Preview,
  Undo,
  Redo, Save
} from '@mui/icons-material'


export default function Buttons(props) {
  const { canUndo, canRedo, setToggles, undo, redo, onSave } = props;
  const togglesAll = useMemo(
    () => ["sectionable", "blockable", "editable", "preview"],
    []
  );
  const toggles = togglesAll.filter((toggle) => props[toggle]);

  const handleToggles = useCallback(
    (event, newToggles) => {
      const _toggles = {};

      togglesAll.forEach((toggle) => {
        _toggles[toggle] = newToggles.includes(toggle);
      });

      setToggles(_toggles);
    },
    [setToggles, togglesAll]
  );

  const handleUndo = (event) => {
    undo();
    event.preventDefault();
    return false;
  };

  const handleRedo = (event) => {
    redo();
    event.preventDefault();
    return false;
  };

  return (
    <ToggleButtonGroup
      data-test-id="ToggleButtonGroup"
      value={toggles}
      onChange={handleToggles}
      aria-label="text formatting"
      className="buttons"
      sx={{mb:2}}
    >
      <ToggleButton
        data-test-id="ToggleButtonSectionable"
        value="sectionable"
        aria-label="sectionable"
      >
        <ViewStream />
      </ToggleButton>
      <ToggleButton
        data-test-id="ToggleButtonBlockable"
        value="blockable"
        aria-label="blockable"
      >
        <Subject />
      </ToggleButton>
      <ToggleButton
        data-test-id="ToggleButtonEditable"
        value="editable"
        aria-label="editable"
      >
        <Edit />
      </ToggleButton>
      <ToggleButton
        data-test-id="ToggleButtonPreview"
        value="preview"
        aria-label="preview"
      >
        <Preview />
      </ToggleButton>
      <ToggleButton
        data-test-id="Undo"
        value="undo"
        aria-label="undo"
        onClick={handleUndo}
        disabled={!canUndo}
      >
        <Undo />
      </ToggleButton>
      <ToggleButton
        data-test-id="Redo"
        value="redo"
        aria-label="redo"
        onClick={handleRedo}
        disabled={!canRedo}
      >
        <Redo />
      </ToggleButton>
      <ToggleButton
        data-test-id="Save"
        value="save"
        aria-label="save"
        onClick={onSave}
      >
        <Save />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
