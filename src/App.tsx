import { useEffect, useState } from "react";
import "./App.css";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

interface Profile {
  name: string;
  created: Date;
  rules: Rule[];
}

interface Rule {
  parameter: string;
  value: string;
  bool: boolean;
}

function App() {
  const [data, internalSetData] = useState<Profile[]>([]);
  const [profileName, setProfileName] = useState<string>("");
  const l = data.filter((d) => d.name === profileName);
  const profile = l.length > 0 ? l[0] : null;
  const [text, setText] = useState<string>("");
  const setData = (data: Profile[], avoid: boolean = false) => {
    if (!avoid) {
      localStorage.setItem("reparr", JSON.stringify(data));
    }
    internalSetData(data);
  };

  const [renaming, setRenaming] = useState<string | null>(null);

  const updateParameter = (index: number, name: string, e: any) =>
    setData(
      data.map((d) =>
        d.name === profile!.name
          ? {
              ...d,
              rules: d.rules.map((r, i) =>
                i === index
                  ? {
                      ...r,
                      [name]: e,
                    }
                  : r
              ),
            }
          : d
      )
    );

  useEffect(() => {
    const value = localStorage.getItem("reparr");
    if (value !== null) {
      setData(JSON.parse(value), true);
    }
  }, []);

  const convertFrom = (telerik: boolean = false) => {
    let t = text;
    for (let i = 0; i < profile!.rules.length; i++) {
      const rule = profile!.rules[i];
      if (telerik) {
        if (rule.bool) {
          t = t.replaceAll(rule.parameter, `${rule.value}`);
        } else {
          t = t.replaceAll(rule.parameter, `'${rule.value}'`);
        }
      } else {
        if (rule.bool) {
          t = t.replaceAll(`${rule.value}`, rule.parameter);
        } else {
          t = t.replaceAll(`'${rule.value}'`, rule.parameter);
        }
      }
    }
    setText(t);
  };

  useEffect(() => {
    if (profile && profile.rules.length === 0) {
      var _text$match$map, _text$match;
      const values =
        (_text$match$map =
          (_text$match = text.match(/@[a-zA-Z]+/g)) === null ||
          _text$match === void 0
            ? void 0
            : _text$match.map((t) => t)) !== null && _text$match$map !== void 0
          ? _text$match$map
          : [];
      let rules = [] as string[];
      for (let i = 0; i < values.length; i++) {
        const rule = values[i];
        if (rules.filter((r) => r === rule).length === 0) {
          rules = [...rules, rule];
        }
      }
      setData(
        data.map((d) =>
          d.name === profileName
            ? {
                ...d,
                rules: rules.map((r) => ({
                  parameter: r,
                  value: "",
                  bool: false,
                })),
              }
            : d
        )
      );
    }
  }, [text]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "95%",
        height: "95%",
        p: 2,
      }}
    >
      <TextField
        sx={{
          flexGrow: 1,
        }}
        rows={30}
        multiline={true}
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></TextField>
      <Box
        sx={{
          w: "400px",
          pl: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Actions
        </Typography>
        <Button variant="contained" onClick={() => convertFrom(true)}>
          From Telerik
        </Button>
        <Button
          variant={"contained"}
          onClick={() => convertFrom()}
          sx={{
            ml: 1,
          }}
          color={"success"}
        >
          From SQL
        </Button>
        <Typography variant={"h5"} gutterBottom>
          Settings
        </Typography>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <FormControl
            fullWidth
            sx={{
              mb: 1,
            }}
          >
            <InputLabel>Profile</InputLabel>
            <Select
              value={profileName}
              label={"Profile"}
              displayEmpty
              onChange={(e) => setProfileName(e.target.value)}
            >
              <MenuItem value={""}>(none selected)</MenuItem>
              {data.map((d) => (
                <MenuItem
                  key={d.name}
                  value={d.name}
                  sx={{
                    justifyContent: "space-between",
                    display: "flex",
                  }}
                >
                  {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box
          display="flex"
          sx={{
            mb: 1,
          }}
        >
          <Button
            onClick={() => {
              const name = "New Profile";
              setData([
                ...data,
                {
                  created: new Date(Date.now()),
                  name: name,
                  rules: [],
                },
              ]);
              setProfileName(name);
            }}
          >
            Add
          </Button>
          <Button onClick={() => setRenaming(profile!.name)}>Rename</Button>
          </Box>
          <Box>
            {profile &&
              profile.rules.map((r, ri) => (
                <Box
                  key={ri}
                  sx={{
                    display: "flex",
                  }}
                >
                  <TextField
                    placeholder={"Parameter"}
                    value={r.parameter}
                    onChange={(e) =>
                      updateParameter(ri, "parameter", e.target.value)
                    }
                  />
                  <TextField
                    placeholder={"Value"}
                    value={r.value}
                    onChange={(e) =>
                      updateParameter(ri, "value", e.target.value)
                    }
                  />{" "}
                  <Checkbox
                    onChange={(e) =>
                      updateParameter(ri, "bool", e.target.checked)
                    }
                  />
                  <Box>
                    <IconButton
                      onClick={() =>
                        setData(
                          data.map((d) =>
                            d.name === profileName
                              ? {
                                  ...d,
                                  rules: d.rules.filter((r, i) => i !== ri),
                                }
                              : d
                          )
                        )
                      }
                    >
                      <Edit />
                    </IconButton>
                  </Box>
                </Box>
              ))}
          </Box>
          <Button
            onClick={() =>
              setData(
                data.map((d) =>
                  d.name === profileName
                    ? {
                        ...d,
                        rules: [
                          ...d.rules,
                          {
                            parameter: "@",
                            value: "",
                            bool: false,
                          },
                        ],
                      }
                    : d
                )
              )
            }
          >
            Add Parameter
          </Button>
      </Box>
      <Dialog open={!!renaming} onClose={() => setRenaming(null)}>
        <DialogTitle>Rename</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the new name below.</DialogContentText>
          <TextField
            autoFocus
            margin={"dense"}
            label={"Name"}
            fullWidth
            value={renaming ?? ""}
            onChange={(e) => setRenaming(e.target.value)}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenaming(null)}>Close</Button>
          <Button
            onClick={() => {
              setData(
                data.map((d) =>
                  d.name === profileName
                    ? {
                        ...d,
                        name: renaming,
                      }
                    : d
                ) as Profile[]
              );
              setProfileName(renaming!);
              setRenaming(null);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
