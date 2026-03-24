import React from 'react';
import { 
  Paper, 
  Grid, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Button 
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

interface SearchBarProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleSearch: () => void;
  handleClear: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export default function SearchBar({
  searchInput,
  setSearchInput,
  handleSearch,
  handleClear,
  handleKeyPress
}: SearchBarProps) {
  return (
    <Paper elevation={1} style={{ padding: '20px', marginBottom: '30px', borderRadius: '8px' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={9} md={10}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Pesquisar vagas pelo título (ex: Desenvolvedor Front-end)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchInput ? (
                <InputAdornment position="end">
                  <IconButton onClick={handleClear} size="small">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            size="large"
            style={{ height: '56px' }}
            onClick={handleSearch}
          >
            Pesquisar
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}