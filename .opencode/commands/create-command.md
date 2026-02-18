---
description: Create a new custom command file with proper structure and formatting
---

# Create Custom Command

This task helps you create a new custom command file with proper structure and formatting.

## Process

1. Gather command information:

   - Ask the user what the purpose of the command is
   - Based on the purpose, suggest an appropriate filename and title:
     - Format: `short-descriptive-name.md`
     - Ensure the filename is lowercase, uses hyphens for spaces, and is descriptive
   - Confirm the suggested name or allow the user to specify a different one

2. Determine command structure:

   - Suggest a structure based on the command's purpose
   - Present common command patterns:
     1. Simple task command (few steps, direct execution)
     2. Multi-step workflow (sequential steps with decision points)
     3. Analytical command (analyses code and provides recommendations)
     4. Generation command (creates new files or content)
   - Ask which pattern is closest to the desired command

3. Create command file:

   - Use the standard command file template:

     ```markdown
     ---
     description: Brief description of what this command does
     ---

     # Command Name

     Brief description of what this command does.

     ## Process

     1. Step One:

        - Substep details
        - More substep details

     2. Step Two:

        - Substep details
        - More substep details

     3. Step Three:
        - Substep details
        - More substep details
     ```

   - Customise the template based on the chosen pattern and purpose
   - Add appropriate placeholders for the user to complete

4. Save the file:

   - Save to `.opencode/commands/[filename].md` for project-level commands
   - Display the full path after saving: "Command file created: [path]"

## Notes

- Commands are manually triggered by the user, unlike skills which are invoked automatically
- Keep command instructions clear and actionable
- Commands can reference skills for detailed domain knowledge
- Argument hints can be added to the frontmatter: `argument-hint: "[description]"`
