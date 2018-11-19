package config

import (
	"fmt"
	"time"
)

// Validate ensures all values in a configuration are consistent, and a
// simulation can be started from it.
func (c Config) Validate() error {
	if c.RNG.Seed == 0 {
		c.RNG.Seed = time.Now().Unix()
	}

	if c.Time.TicksPerDay < 1 {
		return fmt.Errorf("time.ticksPerDay must be greater than 1")
	}

	if c.Time.TotalDays < 1 {
		return fmt.Errorf("time.totalDays must be greater than 1")
	}

	if c.Arena.Width < 1 {
		return fmt.Errorf("arena.width must be greater than 1")
	}

	if c.Arena.Height < 1 {
		return fmt.Errorf("arena.height must be greater than 1")
	}

	if c.Arena.MajorX > c.Arena.Height {
		return fmt.Errorf("arena.majorX cannot be more than arena.height (%d)", c.Arena.Height)
	}

	if c.Arena.MajorY > c.Arena.Width {
		return fmt.Errorf("arena.majorY cannot be more than arena.width (%d)", c.Arena.Width)
	}

	moralSum := c.Moral.MajorMajorLow + c.Moral.MajorMinorLow + c.Moral.MinorMinorLow
	if moralSum != 100 {
		return fmt.Errorf("moral context percentages must add up to 100%% (currently: %d%%)", moralSum)
	}

	workspaceSum := c.Workspace.MajorMajorLow + c.Workspace.MajorMajorHigh +
		c.Workspace.MajorMinorLow + c.Workspace.MajorMinorHigh +
		c.Workspace.MinorMinorLow + c.Workspace.MinorMinorHigh
	if workspaceSum != 100 {
		return fmt.Errorf("workspace distribution percentages must add up to 100%% (currently: %d%%)", workspaceSum)
	}

	if c.Arena.MajorX == 0 && c.Arena.MajorY == 0 {
		if c.Moral.MajorMajorLow > 0 {
			return fmt.Errorf("moral.majorMajorLow cannot be greater than 0 with no major streets")
		}
		if c.Moral.MajorMinorLow > 0 {
			return fmt.Errorf("moral.majorMinorLow cannot be greater than 0 with no major streets")
		}

		if c.Workspace.MajorMajorLow > 0 {
			return fmt.Errorf("workspace.majorMajorLow cannot be greater than 0 with no major streets")
		}

		if c.Workspace.MajorMajorHigh > 0 {
			return fmt.Errorf("workspace.majorMajorHigh cannot be greater than 0 with no major streets")
		}

		if c.Workspace.MajorMinorLow > 0 {
			return fmt.Errorf("workspace.majorMinorLow cannot be greater than 0 with no major streets")
		}

		if c.Workspace.MajorMinorHigh > 0 {
			return fmt.Errorf("workspace.majorMinorHigh cannot be greater than 0 with no major streets")
		}
	}

	if c.Economy.Unemployment > 100 {
		return fmt.Errorf("economy.unemployment cannot be more than 100%%")
	}

	if c.Economy.HiringRate > 100 {
		return fmt.Errorf("economy.hiringRate cannot be more than 100%%")
	}

	if c.Economy.FiringRate > 100 {
		return fmt.Errorf("economy.firingRate cannot be more than 100%%")
	}

	return nil
}
