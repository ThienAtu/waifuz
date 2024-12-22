import { Box, Paper, styled } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";

interface Position {
  row: number;
  col: number;
}

type Waifu = {
  id: number;
  name: string;
  table: {
    row: number;
    column: number;
  };
  source: string;
  images: string;
};

const waifuList: Waifu[] = [
  {
    id: 0,
    name: "Kokomi",
    table: {
      row: 5,
      column: 4,
    },
    source: "src/assets/Kokomi/source.jpg",
    images: "src/assets/Kokomi/",
  },
  {
    id: 1,
    name: "Yoimiya",
    table: {
      row: 5,
      column: 4,
    },
    source: "src/assets/Yoimiya/source.jpg",
    images: "src/assets/Yoimiya/",
  },
];

const WaifuPuzzle = () => {
  const [waifuImage, setWaifuImage] = useState<string[]>([]);
  const [data, setData] = useState<Waifu>();
  const generateRandomGrid = (rows: number, columns: number): number[][] => {
    const numbers = Array.from(
      { length: rows * columns },
      (_, index) => index
    ).splice(1);

    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]]; // Swap elements
    }

    // Insert 0 at the first position
    const gridNumbers = [0, ...numbers];

    const grid: number[][] = [];
    for (let i = 0; i < rows; i++) {
      grid.push(gridNumbers.slice(i * columns, (i + 1) * columns)); // Slice each row
    }

    return grid;
  };

  // State for the grid
  const [grid, setGrid] = useState<number[][]>([]);

  useEffect(() => {
    const waifu =
      waifuList.find((x) => x.id === Math.floor(Math.random() * 2)) ??
      waifuList[0];

    const grid = generateRandomGrid(waifu.table.row, waifu.table.column);
    setGrid(grid);
    setData(waifu);
    console.log(waifu);
    setWaifuImage(
      Array.from(
        { length: waifu.table.column * waifu.table.row },
        (_, index) => `${waifu.images}/${[100 + index]}.png`
      )
    );
  }, []);

  // Track the position of the empty cell (0)
  const [zeroPosition, setZeroPosition] = useState<Position>({
    row: 0,
    col: 0,
  });

  // Move a cell to the position of 0 based on arrow key input
  const moveCell = (direction: string) => {
    const { row, col } = zeroPosition;
    let targetRow = row;
    let targetCol = col;

    switch (direction) {
      case "ArrowUp":
        targetRow = row < grid.length - 1 ? row + 1 : row;
        break;
      case "ArrowDown":
        targetRow = row > 0 ? row - 1 : row;
        break;
      case "ArrowLeft":
        targetCol = col < grid[0].length - 1 ? col + 1 : col;
        break;
      case "ArrowRight":
        targetCol = col > 0 ? col - 1 : col;
        break;
      default:
        return;
    }

    // Swap positions if the move is valid
    if (targetRow !== row || targetCol !== col) {
      const newGrid = grid.map((rowArr) => [...rowArr]); // Create a copy
      const temp = newGrid[targetRow][targetCol];
      newGrid[targetRow][targetCol] = newGrid[row][col];
      newGrid[row][col] = temp;
      setGrid(newGrid);
      setZeroPosition({ row: targetRow, col: targetCol });

      if (checkGridOrder(newGrid)) {
        console.log("Congratulation!");
      }
    }
  };

  // Function to check if the grid is in increasing order from 0 to 24
  const checkGridOrder = (grid: number[][]): boolean => {
    let expectedValue = 0;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] !== expectedValue) {
          return false; // Return false if the current value is not the expected one
        }
        expectedValue++;
      }
    }
    return true; // If we go through all the cells and the values are in order, return true
  };

  // Handle keypress events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      moveCell(event.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [zeroPosition, grid]);

  const Item = styled(Paper)(({ theme }) => ({
    background:
      "linear-gradient(to bottom, rgb(210, 255, 251), rgb(255, 255, 255))",
    padding: theme.spacing(1),
    textAlign: "center",
  }));

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Grid
          columns={20}
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid size={7}>
            <Item>
              <img width={"70%"} src={data?.source} />
            </Item>
          </Grid>
          <Grid size={13}>
            <Item>
              {grid.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  {row.map((cell, colIndex) => {
                    return (
                      <div
                        key={colIndex}
                        style={{
                          width: "160px",
                          height: "160px",
                        }}
                      >
                        {cell !== 0 && (
                          <img
                            src={waifuImage[cell]}
                            alt={`cell-${cell}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default WaifuPuzzle;
